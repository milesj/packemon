/* eslint-disable no-param-reassign */

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
} from '@boost/common';
import rollup from 'rollup';
import spdxLicenses from 'spdx-license-list';
import {
  PackemonPackage,
  PackemonOptions,
  Build,
  Format,
  PackemonPackageConfig,
  Platform,
  BuildFlags,
} from './types';

export default class Packemon extends Contract<PackemonOptions> {
  cwd: Path;

  project: Project;

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
}
