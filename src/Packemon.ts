/* eslint-disable @typescript-eslint/member-ordering, no-param-reassign */

import {
  Path,
  Project,
  Contract,
  Blueprint,
  Predicates,
  toArray,
  optimal,
  predicates,
  WorkspacePackage,
  Memoize,
  PackageStructure,
  parseFile,
} from '@boost/common';
import { PooledPipeline, Context } from '@boost/pipeline';
import spdxLicenses from 'spdx-license-list';
import rollup, { RollupCache } from 'rollup';
import getRollupConfig from './configs/rollup';
import {
  PackemonPackage,
  PackemonOptions,
  Build,
  Format,
  PackemonPackageConfig,
  Platform,
  BuildFlags,
  FeatureFlags,
} from './types';

export default class Packemon extends Contract<PackemonOptions> {
  cwd: Path;

  project: Project;

  private buildCache: Record<string, RollupCache> = {};

  constructor(cwd: string, options: PackemonOptions) {
    super(options);

    this.cwd = Path.create(cwd);
    this.project = new Project(this.cwd);
  }

  blueprint({ bool }: Predicates): Blueprint<PackemonOptions> {
    return {
      addExports: bool(),
      checkLicenses: bool(),
      skipPrivate: bool(),
    };
  }

  async pack() {
    const { packages, workspaces } = this.getPackagesAndWorkspaces();

    if (packages.length === 0) {
      throw new Error('No packages found to build.');
    }

    const builds = this.generateBuilds(packages, workspaces);

    await this.build(builds);
  }

  async build(builds: Build[]): Promise<void> {
    const pipeline = new PooledPipeline(new Context());

    builds.forEach((build) => {
      pipeline.add(`Building ${build.package.name}`, () => this.buildWithRollup(build));
    });

    await pipeline.run();
  }

  async buildWithRollup(build: Build) {
    const packagePath = build.package.packemon.path.relativeTo(this.cwd);
    const featureFlags = this.getFeatureFlags(build.package);
    const { output = [], ...input } = getRollupConfig(
      packagePath,
      build,
      featureFlags,
      this.buildCache[packagePath.path()],
    );

    // Start the build
    const bundle = await rollup.rollup(input);

    // Cache the build
    if (bundle.cache) {
      this.buildCache[packagePath.path()] = bundle.cache;
    }

    // Write each build output
    await Promise.all(toArray(output).map((out) => bundle.write(out)));
  }

  generateBuilds(packages: PackemonPackage[], workspaces: string[]): Build[] {
    return packages.map((pkg) => {
      const config = pkg.packemon;
      const flags: BuildFlags = {};
      const formats = new Set<Format>();
      const platforms = new Set<Platform>();

      toArray(config.platform).forEach((platform) => {
        platforms.add(platform);

        if (formats.has('lib')) {
          flags.requiresSharedLib = true;
        }

        if (platform === 'node') {
          formats.add('lib');
          formats.add('cjs');
          formats.add('mjs');
        } else if (platform === 'browser') {
          formats.add('lib');
          formats.add('esm');

          if (config.namespace) {
            formats.add('umd');
          }
        }
      });

      return {
        flags,
        formats: Array.from(formats),
        meta: {
          namespace: config.namespace,
          workspaces,
        },
        package: pkg,
        platforms: Array.from(platforms),
        target: config.target,
      };
    });
  }

  getFeatureFlags(pkg: PackemonPackage): FeatureFlags {
    const rootPkg = this.project.getPackage<PackemonPackage>();
    const rootFeatureFlags = this.getRootFeatureFlags(rootPkg);

    if (pkg.name === rootPkg.name) {
      return rootFeatureFlags;
    }

    return {
      ...rootFeatureFlags,
      ...this.getRootFeatureFlags(pkg),
    };
  }

  @Memoize()
  getRootFeatureFlags(pkg: PackemonPackage): FeatureFlags {
    const flags: FeatureFlags = {};

    // React
    if (this.hasDependency(pkg, 'react')) {
      flags.react = true;
    }

    // TypeScript
    const tsconfigPath = this.project.root.append('tsconfig.json');

    if (this.hasDependency(pkg, 'typescript') || tsconfigPath.exists()) {
      flags.typescript = true;

      const tsconfig = parseFile<{ compilerOptions?: { experimentalDecorators?: boolean } }>(
        tsconfigPath,
      );

      flags.decorators = Boolean(tsconfig?.compilerOptions?.experimentalDecorators);
    }

    // Flowtype
    const flowconfigPath = this.project.root.append('.flowconfig');

    if (this.hasDependency(pkg, 'flow-bin') || flowconfigPath.exists()) {
      flags.flow = true;
    }

    return flags;
  }

  getPackagesAndWorkspaces(): {
    packages: PackemonPackage[];
    workspaces: string[];
  } {
    const workspaces = this.project.getWorkspaceGlobs({ relative: true });
    let packages: WorkspacePackage<PackemonPackage>[];

    // Multi package repo
    if (workspaces.length > 0) {
      packages = this.project.getWorkspacePackages<PackemonPackage>();

      // Single package repo
    } else {
      packages = [
        {
          metadata: this.project.createWorkspaceMetadata(this.project.root.append('package.json')),
          package: this.project.getPackage<PackemonPackage>(),
        },
      ];
    }

    if (this.options.skipPrivate) {
      packages = packages.filter((pkg) => !pkg.package.private);
    }

    return {
      packages: this.validateAndPreparePackages(packages),
      workspaces,
    };
  }

  validateAndPreparePackages(packages: WorkspacePackage<PackemonPackage>[]): PackemonPackage[] {
    const spdxLicenseTypes = new Set(
      Object.keys(spdxLicenses).map((key) => key.toLocaleLowerCase()),
    );

    // Blueprint for `packemon` block
    const { array, string, union } = predicates;
    const platformPredicate = string('browser').oneOf(['node', 'browser']);
    const blueprint: Blueprint<PackemonPackageConfig> = {
      namespace: string(),
      platform: union([array(platformPredicate), platformPredicate], 'browser'),
      target: string('legacy').oneOf(['legacy', 'modern', 'future']),
    };

    return packages.map(({ metadata, package: pkg }) => {
      // Validate and set metadata
      pkg.packemon = {
        ...optimal(pkg.packemon || {}, blueprint),
        path: Path.create(metadata.packagePath),
      };

      // Validate licenses
      if (this.options.checkLicenses) {
        if (pkg.license) {
          toArray(
            typeof pkg.license === 'string'
              ? { type: pkg.license, url: spdxLicenses[pkg.license] }
              : pkg.license,
          ).forEach((license) => {
            if (!spdxLicenseTypes.has(license.type)) {
              console.error(
                `Invalid license ${license.type} for package ${pkg.name}. Must be an official SPDX license type.`,
              );
            }
          });
        } else {
          console.error(`No license found for package ${pkg.name}.`);
        }
      }

      return pkg;
    });
  }

  protected hasDependency(pkg: PackageStructure, name: string): boolean {
    return Boolean(
      pkg.dependencies?.[name] || pkg.peerDependencies?.[name] || pkg.devDependencies?.[name],
    );
  }
}
