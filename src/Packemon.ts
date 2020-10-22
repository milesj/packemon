import fs from 'fs-extra';
import {
  Blueprint,
  json,
  optimal,
  Path,
  predicates,
  toArray,
  WorkspacePackage,
} from '@boost/common';
import { createDebugger } from '@boost/debug';
import { Event } from '@boost/event';
import { PooledPipeline, Context } from '@boost/pipeline';
import Package from './Package';
import Project from './Project';
import BundleArtifact from './BundleArtifact';
import TypesArtifact from './TypesArtifact';
import {
  BrowserFormat,
  Format,
  NodeFormat,
  BuildOptions,
  PackemonPackage,
  PackemonPackageConfig,
  Platform,
  TypesBuild,
} from './types';

const debug = createDebugger('packemon:core');
const { array, bool, custom, number, object, string, union } = predicates;

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
  inputs: object(string(), { index: 'src/index.ts' }),
  namespace: string(),
  platform: union([array(platformPredicate), platformPredicate], 'browser'),
  support: string('stable').oneOf(['legacy', 'stable', 'current', 'experimental']),
};

export default class Packemon {
  readonly onPackageBuilt = new Event<[Package]>('package-built');

  packages: Package[] = [];

  readonly project: Project;

  readonly root: Path;

  constructor(cwd: string) {
    this.root = Path.resolve(cwd);
    this.project = new Project(this.root);

    debug('Initializing packemon in project %s', this.root);
  }

  async build(baseOptions: BuildOptions) {
    debug('Starting build process');

    const options = optimal(baseOptions, {
      addEngines: bool(),
      addExports: bool(),
      checkLicenses: bool(),
      concurrency: number(1).gte(1),
      generateDeclaration: bool(),
      skipPrivate: bool(),
      timeout: number().gte(0),
    });

    await this.findPackages(options.skipPrivate);
    await this.generateArtifacts(options.generateDeclaration);

    // Build packages in parallel using a pool
    const pipeline = new PooledPipeline(new Context());

    pipeline.configure({
      concurrency: options.concurrency,
      timeout: options.timeout,
    });

    this.packages.forEach((pkg) => {
      pipeline.add(pkg.getName(), async () => {
        await pkg.build(options);

        this.onPackageBuilt.emit([pkg]);
      });
    });

    debug('Building artifacts');

    const { errors } = await pipeline.run();

    // Always cleanup whether a successful or failed build
    debug('Cleaning build artifacts');

    await Promise.all(this.packages.map((pkg) => pkg.cleanup()));

    // Throw to trigger an error screen in the terminal
    if (errors.length > 0) {
      throw errors[0];
    }
  }

  protected async findPackages(skipPrivate: boolean) {
    debug('Finding packages in project');

    const pkgPaths: Path[] = [];

    this.project.workspaces = this.project.getWorkspaceGlobs({ relative: true });

    // Multi package repo
    if (this.project.workspaces.length > 0) {
      debug('Workspaces enabled, finding packages using globs');

      this.project.getWorkspacePackagePaths().forEach((filePath) => {
        pkgPaths.push(Path.create(filePath).append('package.json'));
      });

      // Single package repo
    } else {
      debug('Not workspaces enabled, using root as package');

      pkgPaths.push(this.root.append('package.json'));
    }

    debug('Found %d package(s)', pkgPaths.length);

    const privatePackageNames: string[] = [];

    let packages: WorkspacePackage<PackemonPackage>[] = await Promise.all(
      pkgPaths.map(async (pkgPath) => {
        const contents = json.parse<PackemonPackage>(await fs.readFile(pkgPath.path(), 'utf8'));

        debug(
          '\t%s - %s',
          contents.name,
          pkgPath.path().replace(this.root.path(), '').replace('package.json', ''),
        );

        if (contents.private) {
          privatePackageNames.push(contents.name);
        }

        return {
          metadata: this.project.createWorkspaceMetadata(pkgPath),
          package: contents,
        };
      }),
    );

    // Skip `private` packages
    if (skipPrivate) {
      packages = packages.filter((pkg) => !pkg.package.private);

      debug('Filtering private packages: %s', privatePackageNames.join(', '));
    }

    this.packages = this.validateAndPreparePackages(packages);
  }

  protected generateArtifacts(declarations: boolean) {
    debug('Generating build artifacts for packages');

    this.packages.forEach((pkg) => {
      const typesBuilds: TypesBuild[] = [];
      const libFormatCount = pkg.configs.reduce(
        (sum, config) => (config.formats.includes('lib') ? sum + 1 : sum),
        0,
      );

      pkg.configs.forEach((config) => {
        Object.entries(config.inputs).forEach(([outputName, inputPath]) => {
          const artifact = new BundleArtifact(
            pkg,
            config.formats.map((format) =>
              BundleArtifact.generateBuild(
                format,
                config.support,
                config.platforms,
                // Down-level lib to the lowest target
                libFormatCount > 1,
              ),
            ),
          );
          artifact.inputPath = inputPath;
          artifact.namespace = config.namespace;
          artifact.outputName = outputName;

          pkg.addArtifact(artifact);
          typesBuilds.push({ inputPath, outputName });
        });
      });

      if (declarations) {
        pkg.addArtifact(new TypesArtifact(pkg, typesBuilds));
      }

      debug('\t%s - %s', pkg.getName(), pkg.artifacts.join(', '));
    });
  }

  protected validateAndPreparePackages(packages: WorkspacePackage<PackemonPackage>[]): Package[] {
    debug('Validating found packages');

    const nextPackages: Package[] = [];

    packages.forEach(({ metadata, package: contents }) => {
      if (!contents.packemon) {
        debug('No `packemon` configuration found for %s, skipping', contents.name);

        return;
      }

      const pkg = new Package(this.project, Path.create(metadata.packagePath), contents);

      pkg.setConfigs(
        toArray(contents.packemon).map((config) =>
          optimal(config, blueprint, {
            name: pkg.getName(),
          }),
        ),
      );

      nextPackages.push(pkg);
    });

    return nextPackages;
  }
}
