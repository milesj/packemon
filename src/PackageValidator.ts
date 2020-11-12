import http from 'http';
import https from 'https';
import { DependencyMap, isModuleName, isObject, Path, PeopleSetting, toArray } from '@boost/common';
import spdxLicenses from 'spdx-license-list';
import semver from 'semver';
import execa from 'execa';
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

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  hasWarnings(): boolean {
    return this.warnings.length > 0;
  }

  async validate(options: ValidateOptions) {
    this.checkMetadata();

    const promises: Promise<unknown>[] = [];

    if (options.deps) {
      this.checkDependencies();
    }

    if (options.engines) {
      promises.push(this.checkEngines());
    }

    if (options.entries) {
      this.checkEntryPoints();
    }

    if (options.license) {
      this.checkLicense();
    }

    if (options.links) {
      promises.push(this.checkLinks());
    }

    if (options.people) {
      promises.push(this.checkPeople());
    }

    if (options.repo) {
      promises.push(this.checkRepository());
    }

    await Promise.all(promises);

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

  protected async checkEngines() {
    const { contents } = this;
    const nodeConstraint = contents.engines?.node;
    const npmConstraint = contents.engines?.npm;
    const yarnConstraint = contents.engines?.yarn;

    if (nodeConstraint) {
      const nodeVerison = process.version.slice(1);

      if (!semver.satisfies(nodeVerison, nodeConstraint)) {
        this.warnings.push(
          `Node.js does not satisfy engine constraints. Found ${nodeVerison}, requires ${nodeConstraint}.`,
        );
      }
    }

    if (npmConstraint) {
      const npmVersion = await this.getBinVersion('npm');

      if (!semver.satisfies(npmVersion, npmConstraint)) {
        this.warnings.push(
          `NPM does not satisfy engine constraints. Found ${npmVersion}, requires ${npmConstraint}.`,
        );
      }
    }

    if (yarnConstraint) {
      const yarnVersion = await this.getBinVersion('yarn');

      if (!semver.satisfies(yarnVersion, yarnConstraint)) {
        this.warnings.push(
          `Yarn does not satisfy engine constraints. Found ${yarnVersion}, requires ${yarnConstraint}.`,
        );
      }
    }
  }

  protected checkEntryPoints() {
    const { contents } = this;

    (['main', 'module', 'browser', 'types', 'typings', 'bin', 'man'] as const).forEach((field) => {
      const relPath = contents?.[field];

      if (!relPath || typeof relPath !== 'string') {
        if (field === 'main' && !contents.exports) {
          this.errors.push('Missing primary entry point. Provide a `main` or `exports` field.');
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

    if (Array.isArray(contents.man)) {
      contents.man.forEach((path) => {
        if (!this.doesPathExist(path)) {
          this.errors.push(`Manual "${path}" resolves to an invalid or missing file.`);
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
      this.errors.push('Missing license.');
    }

    if (!this.doesPathExist('LICENSE') && !this.doesPathExist('LICENSE.md')) {
      this.errors.push('No license file found in package. Must be one of LICENSE or LICENSE.md.');
    }
  }

  protected async checkLinks() {
    const { bugs, homepage } = this.contents;
    const bugsUrl = isObject(bugs) ? bugs.url : bugs;

    if (homepage) {
      if (!(await this.doesUrlExist(homepage))) {
        this.warnings.push(
          'Homepage link is invalid. URL is either malformed or upstream is down.',
        );
      }
    }

    if (bugsUrl) {
      if (!(await this.doesUrlExist(bugsUrl))) {
        this.warnings.push('Bugs link is invalid. URL is either malformed or upstream is down.');
      }
    }
  }

  protected checkMetadata() {
    const { contents } = this;

    if (!contents.name) {
      this.errors.push('Missing name.');
    } else if (!isModuleName(contents.name)) {
      this.errors.push('Invalid name format. Must contain alphanumeric characters and dashes.');
    }

    if (!contents.version) {
      this.errors.push('Missing version.');
    }

    if (!contents.description) {
      this.warnings.push('Missing description.');
    }

    if (!contents.keywords || contents.keywords.length === 0) {
      this.warnings.push('Missing keywords.');
    }

    if (!this.doesPathExist('README') && !this.doesPathExist('README.md')) {
      this.errors.push('No readme file found in package. Must be one of README or README.md.');
    }
  }

  protected async checkPeople() {
    const { author, contributors } = this.contents;

    if (!author) {
      this.warnings.push('Missing author.');
    } else if (isObject(author)) {
      if (!author.name) {
        this.errors.push('Missing author name.');
      }

      if (author.url && !(await this.doesUrlExist(author.url))) {
        this.warnings.push('Author URL is invalid. URL is either malformed or upstream is down.');
      }
    }

    if (Array.isArray(contributors)) {
      await Promise.all(
        (contributors as PeopleSetting[]).map(async (contrib) => {
          if (typeof contrib === 'string') {
            return;
          }

          if (!contrib.name) {
            this.errors.push('Missing contributor name.');
          }

          if (contrib.url && !(await this.doesUrlExist(contrib.url))) {
            this.warnings.push(
              'Contributor URL is invalid. URL is either malformed or upstream is down.',
            );
          }
        }),
      );
    } else if (contributors) {
      this.warnings.push('Contributors must be an array.');
    }
  }

  protected async checkRepository() {
    const repo = this.contents.repository;
    const url = isObject(repo) ? repo.url : repo;

    if (!url) {
      this.errors.push('Missing repository.');
    } else if (url.startsWith('http')) {
      if (!(await this.doesUrlExist(url))) {
        this.errors.push('Repository is invalid. URL is either malformed or upstream is down.');
      }
    }

    if (isObject(repo)) {
      const dir = (repo as { directory?: string }).directory;

      if (dir && !this.doesPathExist(dir)) {
        this.errors.push(`Repository directory "${dir}" does not exist.`);
      }
    }
  }

  protected doesPathExist(path: string): boolean {
    return this.path.append(path).exists();
  }

  protected doesUrlExist(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const request = url.startsWith('https') ? https.request : http.request;
      const ping = request(url, () => {
        resolve(true);
        ping.abort();
      });

      ping.on('error', () => {
        resolve(false);
        ping.abort();
      });

      ping.write('');
      ping.end();
    });
  }

  protected async getBinVersion(bin: string): Promise<string> {
    try {
      return (await execa(bin, ['-v'], { preferLocal: true })).stdout.trim();
    } catch {
      return '';
    }
  }
}
