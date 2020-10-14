import fs from 'fs';
import {
  Blueprint,
  Contract,
  json,
  optimal,
  Path,
  predicates,
  Predicates,
  toArray,
  WorkspacePackage,
} from '@boost/common';
import { Event } from '@boost/event';
import { PooledPipeline, Context } from '@boost/pipeline';
import Package from './Package';
import Project from './Project';
import BundleArtifact from './BundleArtifact';
import TypesArtifact from './TypesArtifact';
import {
  ArtifactFlags,
  BrowserFormat,
  Format,
  NodeFormat,
  PackemonOptions,
  PackemonPackage,
  PackemonPackageConfig,
  Platform,
} from './types';

const { array, custom, object, string, union } = predicates;

const platformPredicate = string<Platform>('browser').oneOf(['node', 'browser']);
const nodeFormatPredicate = string<NodeFormat>('lib').oneOf(['lib', 'mjs', 'cjs']);
const browserFormatPredicate = string<BrowserFormat>('lib').oneOf(['lib', 'esm', 'umd']);
const joinedFormatPredicate = string<Format>('lib').oneOf(['lib', 'esm', 'umd', 'mjs', 'cjs']);
const formatPredicate = custom<Format, PackemonPackageConfig>((format, schema) => {
  const platforms = new Set(toArray(schema.struct.platform));

  if (platforms.has('browser') && !platforms.has('node')) {
    return browserFormatPredicate.validate(format as BrowserFormat, schema.currentPath);
  } else if (!platforms.has('browser') && platforms.has('node')) {
    return nodeFormatPredicate.validate(format as NodeFormat, schema.currentPath);
  }

  return joinedFormatPredicate.validate(format, schema.currentPath);
}, 'lib');

const blueprint: Blueprint<Required<PackemonPackageConfig>> = {
  format: union([array(formatPredicate), formatPredicate], []),
  inputs: object(string()),
  namespace: string(),
  platform: union([array(platformPredicate), platformPredicate], 'browser'),
  target: string('legacy').oneOf(['legacy', 'modern', 'future']),
};

export default class Packemon extends Contract<PackemonOptions> {
  readonly onPackagePrepared = new Event<[Package]>('package-prepared');

  packages: Package[] = [];

  readonly project: Project;

  readonly root: Path;

  constructor(cwd: string, options: PackemonOptions) {
    super(options);

    this.root = Path.resolve(cwd);
    this.project = new Project(this.root);
  }

  blueprint({ bool, number }: Predicates): Blueprint<PackemonOptions> {
    return {
      addEngines: bool(),
      addExports: bool(),
      checkLicenses: bool(),
      concurrency: number(1).gte(1),
      generateDeclaration: bool(),
      skipPrivate: bool(),
      timeout: number().gte(0),
    };
  }

  async run() {
    await this.findPackages();
    await this.generateArtifacts();

    const pipeline = new PooledPipeline(new Context());

    pipeline.configure({
      concurrency: this.options.concurrency,
      timeout: this.options.timeout,
    });

    this.packages.forEach((pkg) => {
      pipeline.add(pkg.getName(), async () => {
        await pkg.run(this.options);

        this.onPackagePrepared.emit([pkg]);
      });
    });

    const { errors } = await pipeline.run();

    if (errors.length > 0) {
      throw errors[0];
    }
  }

  protected async findPackages() {
    const pkgPaths: Path[] = [];

    this.project.workspaces = this.project.getWorkspaceGlobs({ relative: true });

    // Multi package repo
    if (this.project.workspaces.length > 0) {
      this.project.getWorkspacePackagePaths().forEach((filePath) => {
        pkgPaths.push(Path.create(filePath).append('package.json'));
      });

      // Single package repo
    } else {
      pkgPaths.push(this.root.append('package.json'));
    }

    let packages: WorkspacePackage<PackemonPackage>[] = await Promise.all(
      pkgPaths.map(async (pkgPath) => {
        const content = json.parse<PackemonPackage>(
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          await fs.promises.readFile(pkgPath.path(), 'utf8'),
        );

        return {
          metadata: this.project.createWorkspaceMetadata(pkgPath),
          package: content,
        };
      }),
    );

    // Skip `private` packages
    if (this.options.skipPrivate) {
      packages = packages.filter((pkg) => !pkg.package.private);
    }

    this.packages = this.validateAndPreparePackages(packages);
  }

  protected generateArtifacts() {
    this.packages.forEach((pkg) => {
      const { config } = pkg;
      const flags: ArtifactFlags = {};
      const formats = new Set<Format>(config.formats);

      if (formats.size === 0) {
        config.platforms.sort().forEach((platform) => {
          if (formats.has('lib')) {
            flags.requiresSharedLib = true;
          }

          if (platform === 'node') {
            formats.add('lib');
          } else if (platform === 'browser') {
            formats.add('lib');
            formats.add('esm');

            if (config.namespace) {
              formats.add('umd');
            }
          }
        });
      }

      Object.entries(config.inputs).forEach(([outputName, inputPath]) => {
        const artifact = new BundleArtifact(pkg, flags);
        artifact.formats = Array.from(formats);
        artifact.inputPath = inputPath;
        artifact.namespace = config.namespace;
        artifact.outputName = outputName;

        pkg.addArtifact(artifact);
      });

      if (this.options.generateDeclaration) {
        pkg.addArtifact(new TypesArtifact(pkg));
      }
    });
  }

  protected validateAndPreparePackages(packages: WorkspacePackage<PackemonPackage>[]): Package[] {
    const nextPackages: Package[] = [];

    packages.forEach(({ metadata, package: contents }) => {
      if (!contents.packemon) {
        return;
      }

      const pkg = new Package(this.project, Path.create(metadata.packagePath), contents);

      pkg.setConfig(
        optimal(contents.packemon, blueprint, {
          name: pkg.getName(),
        }),
      );

      nextPackages.push(pkg);
    });

    return nextPackages;
  }
}
