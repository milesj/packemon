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
import { rollup, RollupCache } from 'rollup';
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
  root: Path;

  project: Project;

  private buildCache: Record<string, RollupCache> = {};

  constructor(cwd: string, options: PackemonOptions) {
    super(options);

    this.root = Path.resolve(cwd);
    this.project = new Project(this.root);
  }

  blueprint({ bool }: Predicates): Blueprint<PackemonOptions> {
    return {
      addExports: bool(),
      checkLicenses: bool(),
      skipPrivate: bool(),
    };
  }

  async build(builds: Build[]) {
    const pipeline = new PooledPipeline(new Context());

    builds.forEach((build) => {
      pipeline.add(`Building ${build.package.name}`, () => this.buildWithRollup(build));
    });

    return pipeline.run();
  }

  async buildWithRollup(build: Build) {
    const packagePath = build.package.packemon.path;
    const featureFlags = this.getFeatureFlags(build.package, build.meta.workspaces);
    const rollupConfig = getRollupConfig(
      packagePath,
      build,
      featureFlags,
      this.buildCache[packagePath.path()],
    );

    // Skip build because of invalid config
    if (!rollupConfig) {
      build.status = 'skipped';

      return;
    }

    const { output = [], ...input } = rollupConfig;

    // Start the build
    build.status = 'building';

    const bundle = await rollup(input);

    // Cache the build
    if (bundle.cache) {
      this.buildCache[packagePath.path()] = bundle.cache;
    }

    // Write each build output
    await Promise.all(
      toArray(output).map(async (out) => {
        try {
          await bundle.write(out);

          build.status = 'passed';
        } catch (error) {
          console.error(error.message);

          build.status = 'failed';
        }
      }),
    );
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
        formats: Array.from(formats).sort(),
        meta: {
          namespace: config.namespace,
          workspaces,
        },
        package: pkg,
        platforms: Array.from(platforms).sort(),
        root: this.root,
        status: 'pending',
        target: config.target,
      };
    });
  }

  getFeatureFlags(pkg: PackemonPackage, workspaces: string[]): FeatureFlags {
    const rootPkg = this.project.getPackage<PackemonPackage>();
    const rootFeatureFlags = this.getRootFeatureFlags(rootPkg, workspaces);

    if (pkg.name === rootPkg.name) {
      return rootFeatureFlags;
    }

    return {
      ...rootFeatureFlags,
      ...this.getRootFeatureFlags(pkg, workspaces),
    };
  }

  @Memoize()
  getRootFeatureFlags(pkg: PackemonPackage, workspaces: string[]): FeatureFlags {
    const flags: FeatureFlags = {
      workspaces,
    };

    // React
    if (this.hasDependency(pkg, 'react')) {
      flags.react = true;
    }

    // TypeScript
    const tsconfigPath = this.root.append('tsconfig.json');

    if (this.hasDependency(pkg, 'typescript') || tsconfigPath.exists()) {
      flags.typescript = true;

      const tsconfig = parseFile<{ compilerOptions?: { experimentalDecorators?: boolean } }>(
        tsconfigPath,
      );

      flags.decorators = Boolean(tsconfig?.compilerOptions?.experimentalDecorators);
    }

    // Flow
    const flowconfigPath = this.root.append('.flowconfig');

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
          metadata: this.project.createWorkspaceMetadata(this.root.append('package.json')),
          package: this.project.getPackage<PackemonPackage>(),
        },
      ];
    }

    // Skip `private` packages
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
            if (!spdxLicenseTypes.has(license.type.toLocaleLowerCase())) {
              console.error(
                `Invalid license ${license.type} for package "${pkg.name}". Must be an official SPDX license type.`,
              );
            }
          });
        } else {
          console.error(`No license found for package "${pkg.name}".`);
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
