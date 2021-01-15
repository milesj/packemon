/* eslint-disable @typescript-eslint/member-ordering */

import path from 'path';
import fs from 'fs-extra';
import rimraf from 'rimraf';
import { isObject, json, Memoize, optimal, Path, toArray, WorkspacePackage } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Event } from '@boost/event';
import { Context, PooledPipeline } from '@boost/pipeline';
import BundleArtifact from './BundleArtifact';
import { getLowestSupport } from './helpers/getLowestSupport';
import Package from './Package';
import PackageValidator from './PackageValidator';
import Project from './Project';
import { buildBlueprint, validateBlueprint } from './schemas';
import {
  BuildOptions,
  BundleBuild,
  DeclarationType,
  PackemonPackage,
  Platform,
  TypesBuild,
  ValidateOptions,
} from './types';
import TypesArtifact from './TypesArtifact';

export default class Packemon {
  readonly debug: Debugger;

  readonly onPackageBuilt = new Event<[Package]>('package-built');

  readonly onPackagesLoaded = new Event<[Package[]]>('packages-loaded');

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

    const options = optimal(baseOptions, buildBlueprint);
    const packages = await this.loadConfiguredPackages(options.skipPrivate);

    this.generateArtifacts(packages, options.declaration);

    // Build packages in parallel using a pool
    const pipeline = new PooledPipeline(new Context());

    pipeline.configure({
      concurrency: options.concurrency,
      timeout: options.timeout,
    });

    packages.forEach((pkg) => {
      pipeline.add(pkg.getName(), async () => {
        await pkg.build(options);

        this.onPackageBuilt.emit([pkg]);
      });
    });

    const { errors } = await pipeline.run();

    // Always cleanup whether a successful or failed build
    await this.cleanTemporaryFiles(packages);

    // Throw to trigger an error screen in the terminal
    if (errors.length > 0) {
      throw errors[0];
    }
  }

  async clean() {
    this.debug('Starting `clean` process');

    const packages = await this.loadConfiguredPackages();

    // Clean package specific files
    await this.cleanTemporaryFiles(packages);

    // Clean build formats
    const formatFolders = '{cjs,esm,lib,mjs,umd}';
    const pathsToRemove: string[] = [];

    if (this.project.isWorkspacesEnabled()) {
      this.project.workspaces.forEach((ws) => {
        pathsToRemove.push(path.join(ws, formatFolders));
      });
    } else {
      pathsToRemove.push(`./${formatFolders}`);
    }

    await Promise.all(
      pathsToRemove.map(
        (rfPath) =>
          new Promise((resolve, reject) => {
            this.debug(' - %s', rfPath);

            rimraf(rfPath, (error) => {
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

    const options = optimal(baseOptions, validateBlueprint);
    const packages = await this.loadConfiguredPackages(options.skipPrivate);

    return Promise.all(packages.map((pkg) => new PackageValidator(pkg).validate(options)));
  }

  /**
   * Find all packages within a project. If using workspaces, return a list of packages
   * from each workspace glob. If not using workspaces, assume project is a package.
   */
  async findPackagesInProject(skipPrivate: boolean = false) {
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

    // Error if no packages are found
    if (packages.length === 0) {
      throw new Error('No packages found in project.');
    }

    return packages;
  }

  /**
   * Generate build and optional types artifacts for each package in the list.
   */
  generateArtifacts(packages: Package[], declarationType: DeclarationType = 'none') {
    this.debug('Generating artifacts for packages');

    packages.forEach((pkg) => {
      const typesBuilds: Record<string, TypesBuild> = {};
      const sharedLib = this.requiresSharedLib(pkg);

      pkg.configs.forEach((config, index) => {
        Object.entries(config.inputs).forEach(([outputName, inputFile]) => {
          const artifact = new BundleArtifact(
            pkg,
            // Must be unique per input to avoid references
            config.formats.map((format) =>
              BundleArtifact.generateBuild(format, config.support, config.platforms),
            ),
          );
          artifact.configGroup = index;
          artifact.inputFile = inputFile;
          artifact.outputName = outputName;
          artifact.namespace = config.namespace;
          artifact.sharedLib = sharedLib;

          pkg.addArtifact(artifact);

          typesBuilds[outputName] = { inputFile, outputName };
        });
      });

      if (declarationType !== 'none') {
        const artifact = new TypesArtifact(pkg, Object.values(typesBuilds));

        artifact.declarationType = declarationType;

        pkg.addArtifact(artifact);
      }

      this.debug(' - %s: %s', pkg.getName(), pkg.artifacts.join(', '));
    });
  }

  /**
   * Find and load all packages that have been configured with a `packemon`
   * block in their `package.json`. Once loaded, validate the configuration.
   */
  @Memoize()
  async loadConfiguredPackages(skipPrivate: boolean = false): Promise<Package[]> {
    const packages = this.validateAndPreparePackages(await this.findPackagesInProject(skipPrivate));

    this.onPackagesLoaded.emit([packages]);

    return packages;
  }

  /**
   * Cleanup all package and artifact related files in all packages.
   */
  protected async cleanTemporaryFiles(packages: Package[]) {
    this.debug('Cleaning temporary build files');

    await Promise.all(packages.map((pkg) => pkg.cleanup()));
  }

  /**
   * Format "lib" is a shared format across all platforms,
   * and when a package wants to support multiple platforms,
   * we must down-level the "lib" format to the lowest platform.
   */
  protected requiresSharedLib(pkg: Package): boolean {
    const platformsToCheck = new Set<Platform>();
    const build: BundleBuild = { format: 'lib', platform: 'node', support: 'stable' };
    let libFormatCount = 0;

    pkg.configs.forEach((config) => {
      config.platforms.forEach((platform) => {
        platformsToCheck.add(platform);
      });

      config.formats.forEach((format) => {
        if (format !== 'lib') {
          return;
        }

        libFormatCount += 1;

        // From widest to narrowest requirements
        if (platformsToCheck.has('browser')) {
          build.platform = 'browser';
        } else if (platformsToCheck.has('native')) {
          build.platform = 'native';
        } else if (platformsToCheck.has('node')) {
          build.platform = 'node';
        }

        // Return the lowest supported target
        build.support = getLowestSupport(build.support, config.support);
      });
    });

    return platformsToCheck.size > 1 && libFormatCount > 1;
  }

  /**
   * Validate that every loaded package has a valid `packemon` configuration,
   * otherwise skip it. All valid packages will return a `Package` instance.
   */
  protected validateAndPreparePackages(packages: WorkspacePackage<PackemonPackage>[]): Package[] {
    this.debug('Validating found packages');

    const nextPackages: Package[] = [];

    packages.forEach(({ metadata, package: contents }) => {
      if (!contents.packemon) {
        this.debug('No `packemon` configuration found for %s, skipping', contents.name);

        return;
      } else if (!isObject(contents.packemon) && !Array.isArray(contents.packemon)) {
        this.debug(
          'Invalid `packemon` configuration for %s, must be an object or array of objects',
          contents.name,
        );

        return;
      }

      const pkg = new Package(this.project, Path.create(metadata.packagePath), contents);

      pkg.setConfigs(toArray(contents.packemon));

      nextPackages.push(pkg);
    });

    return nextPackages;
  }
}
