import fs from 'fs-extra';
import rimraf from 'rimraf';
import {
  Blueprint,
  json,
  optimal,
  Path,
  predicates,
  toArray,
  WorkspacePackage,
} from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Event } from '@boost/event';
import { PooledPipeline, Context } from '@boost/pipeline';
import Package from './Package';
import PackageValidator from './PackageValidator';
import Project from './Project';
import BundleArtifact from './BundleArtifact';
import TypesArtifact from './TypesArtifact';
import {
  AnalyzeType,
  BrowserFormat,
  BuildOptions,
  DeclarationType,
  Format,
  NativeFormat,
  NodeFormat,
  PackemonPackage,
  PackemonPackageConfig,
  Platform,
  TypesBuild,
  ValidateOptions,
} from './types';
import { DEFAULT_FORMAT, DEFAULT_INPUT, DEFAULT_PLATFORM, DEFAULT_SUPPORT } from './constants';

const { array, bool, custom, number, object, string, union } = predicates;

const platformPredicate = string<Platform>(DEFAULT_PLATFORM).oneOf(['native', 'node', 'browser']);
const nativeFormatPredicate = string<NativeFormat>(DEFAULT_FORMAT).oneOf(['lib']);
const nodeFormatPredicate = string<NodeFormat>(DEFAULT_FORMAT).oneOf(['lib', 'mjs', 'cjs']);
const browserFormatPredicate = string<BrowserFormat>(DEFAULT_FORMAT).oneOf(['lib', 'esm', 'umd']);
const joinedFormatPredicate = string<Format>(DEFAULT_FORMAT).oneOf([
  'lib',
  'esm',
  'umd',
  'mjs',
  'cjs',
]);
const formatPredicate = custom<Format, PackemonPackageConfig>((format, schema) => {
  const platforms = new Set(toArray(schema.struct.platform));

  if (platforms.has('browser') && platforms.size === 1) {
    return browserFormatPredicate.validate(format as BrowserFormat, schema.currentPath);
  } else if (platforms.has('native') && platforms.size === 1) {
    return nativeFormatPredicate.validate(format as NativeFormat, schema.currentPath);
  } else if (platforms.has('node') && platforms.size === 1) {
    return nodeFormatPredicate.validate(format as NodeFormat, schema.currentPath);
  }

  return joinedFormatPredicate.validate(format, schema.currentPath);
}, DEFAULT_FORMAT);

const blueprint: Blueprint<Required<PackemonPackageConfig>> = {
  format: union([array(formatPredicate), formatPredicate], []),
  inputs: object(string(), { index: DEFAULT_INPUT }),
  namespace: string(),
  platform: union([array(platformPredicate), platformPredicate], DEFAULT_PLATFORM),
  support: string(DEFAULT_SUPPORT).oneOf(['legacy', 'stable', 'current', 'experimental']),
};

export default class Packemon {
  readonly debug: Debugger;

  readonly onPackageBuilt = new Event<[Package]>('package-built');

  packages: Package[] = [];

  readonly project: Project;

  readonly root: Path;

  constructor(cwd: string = process.cwd()) {
    this.root = Path.resolve(cwd);
    this.project = new Project(this.root);
    this.debug = createDebugger('packemon:core');

    this.debug('Initializing packemon in project %s', this.root);

    this.project.checkEngineVersionConstraint();
  }

  async build(baseOptions: Partial<BuildOptions>) {
    this.debug('Starting `build` process');

    const options = optimal(baseOptions, {
      addEngines: bool(),
      addExports: bool(),
      analyzeBundle: string('none').oneOf<AnalyzeType>(['none', 'sunburst', 'treemap', 'network']),
      concurrency: number(1).gte(1),
      generateDeclaration: string('none').oneOf<DeclarationType>(['none', 'standard', 'api']),
      skipPrivate: bool(),
      timeout: number().gte(0),
    });

    await this.loadConfiguredPackages(options.skipPrivate);
    this.generateArtifacts(options.generateDeclaration);

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

    const { errors } = await pipeline.run();

    // Always cleanup whether a successful or failed build
    await this.cleanTemporaryFiles();

    // Throw to trigger an error screen in the terminal
    if (errors.length > 0) {
      throw errors[0];
    }
  }

  async clean() {
    this.debug('Starting `clean` process');

    await this.loadConfiguredPackages();
    await this.cleanTemporaryFiles();

    const formatFolders = '{cjs,dts,esm,lib,mjs,umd}';
    const pathsToRemove: string[] = [];

    if (this.project.isWorkspacesEnabled()) {
      this.project.workspaces.forEach((ws) => {
        let path = ws;

        if (path.endsWith('*')) {
          path += `/${formatFolders}`;
        } else if (path.endsWith('/')) {
          path += formatFolders;
        }

        pathsToRemove.push(path);
      });
    } else {
      pathsToRemove.push(`./${formatFolders}`);
    }

    await Promise.all(
      pathsToRemove.map(
        (path) =>
          new Promise((resolve, reject) => {
            this.debug(' - %s', path);

            rimraf(path, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve(undefined);
              }
            });
          }),
      ),
    );
  }

  async validate(baseOptions: Partial<ValidateOptions>): Promise<PackageValidator[]> {
    this.debug('Starting `validate` process');

    const options = optimal(baseOptions, {
      deps: bool(true),
      engines: bool(true),
      entries: bool(true),
      license: bool(true),
      links: bool(true),
      people: bool(true),
      repo: bool(true),
    });

    await this.loadConfiguredPackages();

    return Promise.all(this.packages.map((pkg) => new PackageValidator(pkg).validate(options)));
  }

  async loadConfiguredPackages(skipPrivate: boolean = false) {
    if (this.packages.length === 0) {
      this.packages = this.validateAndPreparePackages(await this.findPackages(skipPrivate));
    }

    return this.packages;
  }

  async findPackages(skipPrivate: boolean = false) {
    this.debug('Finding packages in project');

    const pkgPaths: Path[] = [];

    this.project.workspaces = this.project.getWorkspaceGlobs({ relative: true });

    // Multi package repo
    if (this.project.workspaces.length > 0) {
      this.debug('Workspaces enabled, finding packages using globs');

      this.project.getWorkspacePackagePaths().forEach((filePath) => {
        pkgPaths.push(Path.create(filePath).append('package.json'));
      });

      // Single package repo
    } else {
      this.debug('Not workspaces enabled, using root as package');

      pkgPaths.push(this.root.append('package.json'));
    }

    this.debug('Found %d package(s)', pkgPaths.length);

    const privatePackageNames: string[] = [];

    let packages: WorkspacePackage<PackemonPackage>[] = await Promise.all(
      pkgPaths.map(async (pkgPath) => {
        const contents = json.parse<PackemonPackage>(await fs.readFile(pkgPath.path(), 'utf8'));

        this.debug(
          ' - %s: %s',
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

      this.debug('Filtering private packages: %s', privatePackageNames.join(', '));
    }

    return packages;
  }

  generateArtifacts(declarationType?: DeclarationType) {
    this.debug('Generating build artifacts for packages');

    this.packages.forEach((pkg) => {
      const typesBuilds: TypesBuild[] = [];
      const requiresSharedLib = this.requiresSharedLib(pkg);

      pkg.configs.forEach((config) => {
        Object.entries(config.inputs).forEach(([outputName, inputPath]) => {
          const artifact = new BundleArtifact(
            pkg,
            // Must be unique per input to avoid references
            config.formats.map((format) =>
              BundleArtifact.generateBuild(
                format,
                config.support,
                config.platforms,
                requiresSharedLib,
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

      if (declarationType && declarationType !== 'none') {
        const artifact = new TypesArtifact(pkg, typesBuilds);
        artifact.declarationType = declarationType;

        pkg.addArtifact(artifact);
      }

      this.debug(' - %s: %s', pkg.getName(), pkg.artifacts.join(', '));
    });
  }

  protected async cleanTemporaryFiles() {
    this.debug('Cleaning temporary build files');

    await Promise.all(this.packages.map((pkg) => pkg.cleanup()));
  }

  protected requiresSharedLib(pkg: Package): boolean {
    const platformsToBuild = new Set<Platform>();
    let libFormatCount = 0;

    return pkg.configs.some((config) => {
      config.platforms.forEach((platform) => {
        platformsToBuild.add(platform);
      });

      config.formats.forEach((format) => {
        if (format === 'lib') {
          libFormatCount += 1;
        }
      });

      return platformsToBuild.size > 1 && libFormatCount > 1;
    });
  }

  protected validateAndPreparePackages(packages: WorkspacePackage<PackemonPackage>[]): Package[] {
    this.debug('Validating found packages');

    const nextPackages: Package[] = [];

    packages.forEach(({ metadata, package: contents }) => {
      if (!contents.packemon) {
        this.debug('No `packemon` configuration found for %s, skipping', contents.name);

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
