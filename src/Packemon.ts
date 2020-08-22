import {
  Path,
  Project,
  Contract,
  Blueprint,
  Predicates,
  toArray,
  optimal,
  predicates,
} from '@boost/common';
import spdxLicenses from 'spdx-license-list';
import { PackemonPackage, PackemonOptions, Build, Format } from './types';

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
    const { string } = predicates;
    const blueprint = {
      namespace: string(),
      platform: string('browser').oneOf(['node', 'browser']),
      target: string('legacy').oneOf(['legacy', 'modern', 'future']),
    };

    return packages.map((pkg) => {
      const { namespace, platform, target } = optimal(pkg.packemon || {}, blueprint);
      const formats: Format[] = [];

      if (platform === 'node') {
        formats.push('lib', 'cjs', 'mjs');
      } else if (platform === 'browser') {
        formats.push('lib', 'esm');

        if (namespace) {
          formats.push('umd');
        }
      }

      return {
        formats,
        meta: {
          namespace,
          workspaces,
        },
        package: pkg,
        path: new Path(),
        platform,
        target,
      };
    });
  }

  getPackagesAndWorkspaces(): {
    packages: PackemonPackage[];
    workspaces: string[];
  } {
    const workspaces = this.project.getWorkspaceGlobs({ relative: true });
    let packages: PackemonPackage[] = [];

    // Multi package repo
    if (workspaces.length > 0) {
      packages = this.project.getWorkspacePackages<PackemonPackage>().map((pkg) => pkg.package);

      // Single package repo
    } else {
      packages = [this.project.getPackage<PackemonPackage>()];
    }

    if (this.options.skipPrivate) {
      packages = packages.filter((pkg) => !pkg.private);
    }

    return {
      packages: this.validatePackages(packages),
      workspaces,
    };
  }

  validatePackages(packages: PackemonPackage[]): PackemonPackage[] {
    const spdxLicenseTypes = new Set(
      Object.keys(spdxLicenses).map((key) => key.toLocaleLowerCase()),
    );

    return packages.map((pkg) => {
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
