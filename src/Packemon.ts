/* eslint-disable no-param-reassign, require-atomic-updates, @typescript-eslint/member-ordering */

import fs from 'fs';
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
  json,
} from '@boost/common';
import { Event } from '@boost/event';
import { PooledPipeline, Context } from '@boost/pipeline';
import spdxLicenses from 'spdx-license-list';
import { rollup } from 'rollup';
import { getRollupConfig } from './configs/rollup';
import Build from './Build';
import {
  PackemonPackage,
  PackemonOptions,
  Format,
  PackemonPackageConfig,
  Platform,
  BuildFlags,
  FeatureFlags,
} from './types';

export default class Packemon extends Contract<PackemonOptions> {
  builds: Build[] = [];

  root: Path;

  project: Project;

  readonly onComplete = new Event('complete');

  readonly onBootProgress = new Event<[number, number]>('boot-progress');

  constructor(cwd: string, options: PackemonOptions) {
    super(options);

    this.root = Path.resolve(cwd);
    this.project = new Project(this.root);
  }

  blueprint({ bool, number }: Predicates): Blueprint<PackemonOptions> {
    return {
      addExports: bool(), // TODO
      checkLicenses: bool(),
      concurrency: number(1).gte(1),
      skipPrivate: bool(),
      timeout: number().gte(0),
    };
  }

  async boot() {
    const result = await this.getPackagesAndWorkspaces();

    this.builds = this.generateBuilds(result.packages, result.workspaces);
  }

  async build() {
    if (this.builds.length === 0) {
      throw new Error('No builds found. Aborting.');
    }

    const pipeline = new PooledPipeline(new Context());

    pipeline.configure({
      concurrency: this.options.concurrency,
      timeout: this.options.timeout,
    });

    this.builds.forEach((build) => {
      pipeline.add(`Building ${build.name}`, () => this.buildWithRollup(build));
    });

    const result = await pipeline.run();

    // Mark all running builds as skipped
    if (result.errors.length > 0) {
      this.builds.forEach((build) => {
        if (build.status === 'building') {
          build.status = 'skipped';
        }
      });
    }

    return result;
  }

  async buildWithRollup(build: Build) {
    const rollupConfig = getRollupConfig(build, this.getFeatureFlags(build));

    // Skip build because of invalid config
    if (!rollupConfig) {
      build.status = 'skipped';

      return;
    }

    build.status = 'building';

    const { output = [], ...input } = rollupConfig;
    const bundle = await rollup(input);

    // Cache the build
    if (bundle.cache) {
      build.cache = bundle.cache;
    }

    // Write each build output
    const start = Date.now();

    build.result = {
      output: [],
      time: 0,
    };

    await Promise.all(
      toArray(output).map(async (out) => {
        const { originalFormat, ...outOptions } = out;

        try {
          await bundle.write(outOptions);

          build.status = 'passed';
        } catch (error) {
          build.status = 'failed';

          throw error;
        }

        build.result?.output.push({
          format: originalFormat!,
          path: out.file!,
        });
      }),
    );

    build.result.time = Date.now() - start;
  }

  async pack() {
    this.onComplete.emit([]);
  }

  protected generateBuilds(packages: PackemonPackage[], workspaces: string[]): Build[] {
    const builds: Build[] = [];

    packages.forEach((pkg) => {
      const config = pkg.packemon;
      const flags: BuildFlags = {};
      const formats = new Set<Format>();
      const platforms = new Set<Platform>();

      toArray(config.platform)
        .sort()
        .forEach((platform) => {
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

      Object.entries(config.inputs).forEach(([name, path]) => {
        const build = new Build(this.root, pkg, workspaces);
        build.flags = flags;
        build.formats = Array.from(formats);
        build.meta.namespace = config.namespace;
        build.platforms = Array.from(platforms);
        build.target = config.target;
        build.inputName = name;
        build.inputPath = path;

        builds.push(build);
      });
    });

    return builds;
  }

  protected getFeatureFlags(build: Build): FeatureFlags {
    return {
      ...this.getRootFeatureFlags(),
      ...build.getFeatureFlags(),
    };
  }

  @Memoize()
  protected getRootFeatureFlags(): FeatureFlags {
    return new Build(this.root, this.project.getPackage<PackemonPackage>(), []).getFeatureFlags();
  }

  protected async getPackagesAndWorkspaces(): Promise<{
    packages: PackemonPackage[];
    workspaces: string[];
  }> {
    const workspaces = this.project.getWorkspaceGlobs({ relative: true });
    const pkgPaths: Path[] = [];

    this.onBootProgress.emit([0, pkgPaths.length]);

    // Multi package repo
    if (workspaces.length > 0) {
      this.project.getWorkspacePackagePaths().forEach((filePath) => {
        pkgPaths.push(Path.create(filePath).append('package.json'));
      });

      // Single package repo
    } else {
      pkgPaths.push(this.root.append('package.json'));
    }

    this.onBootProgress.emit([0, pkgPaths.length]);

    let counter = 0;
    let packages: WorkspacePackage<PackemonPackage>[] = await Promise.all(
      pkgPaths.map(async (pkgPath) => {
        const content = json.parse<PackemonPackage>(
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          await fs.promises.readFile(pkgPath.path(), 'utf8'),
        );

        counter += 1;
        this.onBootProgress.emit([counter, pkgPaths.length]);

        return {
          metadata: this.project.createWorkspaceMetadata(pkgPath),
          package: content,
        };
      }),
    );

    this.onBootProgress.emit([pkgPaths.length, pkgPaths.length]);

    // Skip `private` packages
    if (this.options.skipPrivate) {
      packages = packages.filter((pkg) => !pkg.package.private);
    }

    return {
      packages: this.validateAndPreparePackages(packages),
      workspaces,
    };
  }

  protected validateAndPreparePackages(
    packages: WorkspacePackage<PackemonPackage>[],
  ): PackemonPackage[] {
    const spdxLicenseTypes = new Set(
      Object.keys(spdxLicenses).map((key) => key.toLocaleLowerCase()),
    );

    // Blueprint for `packemon` block
    const { array, object, string, union } = predicates;
    const platformPredicate = string('browser').oneOf(['node', 'browser']);
    const blueprint: Blueprint<PackemonPackageConfig> = {
      inputs: object(string(), { index: 'src/index.ts' }),
      namespace: string(),
      platform: union([array(platformPredicate), platformPredicate], 'browser'),
      target: string('legacy').oneOf(['legacy', 'modern', 'future']),
    };

    // Filter packages that only have packemon configured
    const nextPackages: PackemonPackage[] = [];

    packages.forEach(({ metadata, package: pkg }) => {
      if (!pkg.packemon) {
        return;
      }

      // Validate and set metadata
      pkg.packemon = {
        ...optimal(pkg.packemon, blueprint),
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

      nextPackages.push(pkg);
    });

    return nextPackages;
  }
}
