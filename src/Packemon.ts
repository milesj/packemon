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
import Artifact from './Artifact';
import BundleArtifact from './BundleArtifact';
import {
  ArtifactFlags,
  BrowserFormat,
  Format,
  NodeFormat,
  PackemonOptions,
  PackemonPackage,
  PackemonPackageConfig,
  Phase,
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
  readonly root: Path;

  readonly onArtifactUpdate = new Event<[Artifact]>('artifact-update');

  readonly onPackageUpdate = new Event<[Package]>('package-update');

  readonly onPhaseChange = new Event<[Phase]>('phase-change');

  packages: Package[] = [];

  phase: Phase = 'boot';

  readonly project: Project;

  constructor(cwd: string, options: PackemonOptions) {
    super(options);

    this.root = Path.resolve(cwd);
    this.project = new Project(this.root);
  }

  blueprint({ bool, number }: Predicates): Blueprint<PackemonOptions> {
    return {
      addExports: bool(),
      checkLicenses: bool(),
      concurrency: number(1).gte(1),
      skipPrivate: bool(),
      timeout: number().gte(0),
    };
  }

  async run() {
    const { checkLicenses, addExports } = this.options;

    await this.findPackages();
    await this.generateArtifacts();

    // Bootstrap artifacts
    this.updatePhase('boot');

    await this.processPackages((pkg) => pkg.boot({ checkLicenses }));

    // Build artifacts
    this.updatePhase('build');

    await this.processPackages((pkg) => pkg.build({}));

    // Package artifacts
    this.updatePhase('pack');

    await this.processPackages((pkg) => pkg.pack({ addExports }));

    // Done!
    this.updatePhase('done');

    await this.processPackages((pkg) => pkg.complete());
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
            // formats.add('cjs');
            // formats.add('mjs');
          } else if (platform === 'browser') {
            formats.add('lib');
            formats.add('esm');

            if (config.namespace) {
              formats.add('umd');
            }
          }
        });
      }

      Object.entries(config.inputs || { index: 'src/index.ts' }).forEach(([name, path]) => {
        const artifact = new BundleArtifact(pkg);
        artifact.flags = flags;
        artifact.formats = Array.from(formats);
        artifact.inputPath = path;
        artifact.namespace = config.namespace;
        artifact.outputName = name;

        pkg.addArtifact(artifact);
      });

      this.onPackageUpdate.emit([pkg]);
    });
  }

  protected async processPackages(callback: (pkg: Package) => Promise<void>): Promise<void> {
    const pipeline = new PooledPipeline(new Context());

    pipeline.configure({
      concurrency: this.options.concurrency,
      timeout: this.options.timeout,
    });

    const notifyArtifacts = (pkg: Package) => {
      pkg.artifacts.forEach((artifact) => {
        this.onArtifactUpdate.emit([artifact]);
      });
    };

    this.packages.forEach((pkg) => {
      pipeline.add(pkg.getName(), async () => {
        const promise = callback(pkg);

        // Update once the promise has started
        notifyArtifacts(pkg);

        // Update again once it has completed
        return promise.then(() => {
          this.onPackageUpdate.emit([pkg]);
          notifyArtifacts(pkg);
        });
      });
    });

    const { errors } = await pipeline.run();

    if (errors.length > 0) {
      throw errors[0];
    }
  }

  protected updatePhase(phase: Phase) {
    this.phase = phase;
    this.onPhaseChange.emit([phase]);
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
