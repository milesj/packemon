/* eslint-disable no-param-reassign */

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
import spdxLicenses from 'spdx-license-list';
import Package from './Package';
import Project from './Project';
import RollupArtifact from './RollupArtifact';
import {
  ArtifactFlags,
  Format,
  PackemonOptions,
  PackemonPackage,
  PackemonPackageConfig,
  Platform,
} from './types';

export default class Packemon extends Contract<PackemonOptions> {
  root: Path;

  packages: Package[] = [];

  project: Project;

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

  async run() {
    // Find all packages
    this.packages = await this.getPackages();

    // Generate artifacts for each package
    await this.generateArtifacts();

    // Build all artifacts in parallel
    await this.buildArtifacts();
  }

  protected async buildArtifacts() {
    const pipeline = new PooledPipeline(new Context());

    pipeline.configure({
      concurrency: this.options.concurrency,
      timeout: this.options.timeout,
    });

    this.packages.forEach((pkg) => {
      pkg.artifacts.forEach((artifact) => {
        pipeline.add(`Building ${artifact.name} for package ${pkg.name}`, () => artifact.build());
      });
    });

    await pipeline.run();
  }

  protected generateArtifacts() {
    this.packages.forEach((pkg) => {
      const config = pkg.contents.packemon;
      const flags: ArtifactFlags = {};
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
        const artifact = new RollupArtifact(pkg);
        artifact.flags = flags;
        artifact.formats = Array.from(formats);
        artifact.inputPath = path;
        artifact.namespace = config.namespace;
        artifact.outputName = name;
        artifact.platforms = Array.from(platforms);
        artifact.target = config.target;

        pkg.addArtifact(artifact);
      });
    });
  }

  protected async getPackages(): Promise<Package[]> {
    const pkgPaths: Path[] = [];

    this.project.workspaces = this.project.getWorkspaceGlobs({ relative: true });
    this.onBootProgress.emit([0, pkgPaths.length]);

    // Multi package repo
    if (this.project.workspaces.length > 0) {
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

    return this.validateAndPreparePackages(packages);
  }

  protected validateAndPreparePackages(packages: WorkspacePackage<PackemonPackage>[]): Package[] {
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
    const nextPackages: Package[] = [];

    packages.forEach(({ metadata, package: contents }) => {
      if (!contents.packemon) {
        return;
      }

      // Validate and set metadata
      contents.packemon = optimal(contents.packemon, blueprint);

      // Validate licenses
      if (this.options.checkLicenses) {
        if (contents.license) {
          toArray(
            typeof contents.license === 'string'
              ? { type: contents.license, url: spdxLicenses[contents.license] }
              : contents.license,
          ).forEach((license) => {
            if (!spdxLicenseTypes.has(license.type.toLocaleLowerCase())) {
              console.error(
                `Invalid license ${license.type} for package "${contents.name}". Must be an official SPDX license type.`,
              );
            }
          });
        } else {
          console.error(`No license found for package "${contents.name}".`);
        }
      }

      nextPackages.push(new Package(this.project, Path.create(metadata.packagePath), contents));
    });

    return nextPackages;
  }
}
