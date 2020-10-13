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
import Artifact from './Artifact';
import BundleArtifact from './BundleArtifact';
import {
  ArtifactFlags,
  ArtifactState,
  Format,
  PackemonOptions,
  PackemonPackage,
  PackemonPackageConfig,
  Phase,
} from './types';

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
      addExports: bool(), // TODO
      checkLicenses: bool(),
      concurrency: number(1).gte(1),
      skipPrivate: bool(),
      timeout: number().gte(0),
    };
  }

  async run() {
    // Find packages and generate artifacts
    await this.findPackages();
    await this.generateArtifacts();

    // Bootstrap artifacts
    this.updatePhase('boot');

    await this.processArtifacts('booting', (artifact) => artifact.boot());

    // Build artifacts
    this.updatePhase('build');

    await this.processArtifacts('building', (artifact) => artifact.build());

    // Package artifacts
    this.updatePhase('pack');

    await this.processArtifacts('packing', (artifact) => artifact.pack());

    // Done!
    this.updatePhase('done');

    await this.processArtifacts('passed');
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
      const config = pkg.contents.packemon;
      const flags: ArtifactFlags = {};
      const formats = new Set<Format>();

      pkg.platforms.sort().forEach((platform) => {
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

  protected async processArtifacts(
    status: ArtifactState,
    callback?: (artifact: Artifact) => Promise<void>,
  ): Promise<void> {
    const pipeline = new PooledPipeline(new Context());

    pipeline.configure({
      concurrency: this.options.concurrency,
      timeout: this.options.timeout,
    });

    this.packages.forEach((pkg) => {
      pkg.artifacts.forEach((artifact) => {
        if (artifact.shouldSkip()) {
          return;
        }

        pipeline.add(`${status} ${artifact.getLabel()} (${pkg.getName()})`, async () => {
          artifact.state = status;

          if (callback) {
            await callback(artifact);
          }

          this.onArtifactUpdate.emit([artifact]);
        });
      });
    });

    const { errors } = await pipeline.run();

    if (errors.length > 0) {
      throw errors[0];
    }

    this.packages.forEach((pkg) => {
      this.onPackageUpdate.emit([pkg]);
    });

    // We need a short timeout so the CLI can refresh
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }

  protected updatePhase(phase: Phase) {
    this.phase = phase;
    this.onPhaseChange.emit([phase]);
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
