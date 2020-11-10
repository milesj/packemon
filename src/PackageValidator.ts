import { DependencyMap, isObject, Path, toArray } from '@boost/common';
import spdxLicenses from 'spdx-license-list';
import semver from 'semver';
import { PackemonPackage, ValidateOptions } from './types';

export default class PackageValidator {
  contents: PackemonPackage;

  errors: string[] = [];

  path: Path;

  warnings: string[] = [];

  constructor(path: Path, contents: PackemonPackage) {
    this.path = path;
    this.contents = contents;
  }

  validate(options: ValidateOptions) {
    this.checkName();

    if (options.deps) {
      this.checkDependencies();
    }

    if (options.engines) {
      this.checkEngines();
    }

    if (options.entries) {
      this.checkEntryPoints();
    }

    if (options.license) {
      this.checkLicense();
    }

    return this;
  }

  protected checkDependencies() {
    const { contents } = this;

    this.checkDependencyRange(contents.dependencies);
    this.checkDependencyRange(contents.devDependencies);
    this.checkDependencyRange(contents.peerDependencies);
    this.checkDependencyRange(contents.optionalDependencies);

    Object.entries(contents.peerDependencies || {}).forEach(([name, version]) => {
      const devVersion = contents.devDependencies?.[name];
      const prodVersion = contents.dependencies?.[name];

      if (!devVersion) {
        this.warnings.push(
          `Peer dependency "${name}" is missing a version satisfying dev dependency.`,
        );
      } else if (!semver.satisfies(devVersion, version)) {
        this.errors.push(
          `Dev dependency "${name}" does not satisfy version constraint of its peer. Found ${devVersion}, requires ${version}.`,
        );
      }

      if (prodVersion) {
        this.errors.push(`Dependency "${name}" defined as both a prod and peer dependency.`);
      }
    });
  }

  protected checkDependencyRange(deps?: DependencyMap) {
    Object.entries(deps || {}).forEach(([name, version]) => {
      if (version.startsWith('file:')) {
        this.errors.push(
          `Dependency "${name}" must not require the file system. Found file: constraint.`,
        );
      } else if (version.startsWith('link:')) {
        this.errors.push(`Dependency "${name}" must not require symlinks. Found link: constraint.`);
      }
    });
  }

  protected checkEngines() {
    // ls-engines
  }

  protected checkEntryPoints() {
    const { contents } = this;

    (['main', 'module', 'browser', 'types', 'typings', 'bin'] as const).forEach((field) => {
      const relPath = contents?.[field];

      if (!relPath || typeof relPath !== 'string') {
        if (field === 'main' && !contents.exports) {
          this.errors.push('No "main" entry point.');
        }

        return;
      }

      if (!this.doesPathExist(relPath)) {
        this.errors.push(`Entry point "${field}" resolves to an invalid or missing file.`);
      }
    });

    if (isObject(contents.bin)) {
      Object.entries(contents.bin).forEach(([name, path]) => {
        if (!this.doesPathExist(path)) {
          this.errors.push(`Binary "${name}" resolves to an invalid or missing file.`);
        }
      });
    }
  }

  protected checkLicense() {
    const { contents } = this;
    const spdxLicenseTypes = new Set(
      Object.keys(spdxLicenses).map((key) => key.toLocaleLowerCase()),
    );

    if (contents.license) {
      toArray(
        typeof contents.license === 'string'
          ? { type: contents.license, url: spdxLicenses[contents.license] }
          : contents.license,
      ).forEach((license) => {
        if (!spdxLicenseTypes.has(license.type.toLocaleLowerCase())) {
          this.errors.push(
            `Invalid license "${license.type}". Must be an official SPDX license type.`,
          );
        }
      });
    } else {
      this.errors.push('No license field found.');
    }

    if (!this.doesPathExist('LICENSE') && !this.doesPathExist('LICENSE.md')) {
      this.errors.push('No license file found in package. Must be one of LICENSE or LICENSE.md.');
    }
  }

  protected checkOwnership() {
    // author, contribs
  }

  protected checkName() {}

  protected checkRepository() {}

  protected doesPathExist(path: string): boolean {
    return this.path.append(path).exists();
  }
}
