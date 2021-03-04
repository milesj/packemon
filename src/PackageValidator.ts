import http from 'http';
import https from 'https';
import execa from 'execa';
import glob from 'fast-glob';
import fs from 'fs-extra';
import ignore from 'ignore';
import semver from 'semver';
import spdxLicenses from 'spdx-license-list';
import { DependencyMap, isModuleName, isObject, Path, PeopleSetting, toArray } from '@boost/common';
import { FORMATS } from './constants';
import { Package } from './Package';
import { ValidateOptions } from './types';

export class PackageValidator {
  static entryPoints: string[] = ['main', 'module', 'browser', 'types', 'typings', 'bin', 'man'];

  errors: string[] = [];

  package: Package;

  warnings: string[] = [];

  constructor(pkg: Package) {
    this.package = pkg;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  hasWarnings(): boolean {
    return this.warnings.length > 0;
  }

  async validate(options: ValidateOptions) {
    const promises: Promise<unknown>[] = [];

    if (options.meta) {
      this.checkMetadata();
    }

    if (options.deps) {
      this.checkDependencies();
    }

    if (options.engines) {
      promises.push(this.checkEngines());
    }

    if (options.entries) {
      this.checkEntryPoints();
    }

    if (options.ignore) {
      promises.push(this.checkIgnoredFiles());
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
    this.package.debug('Checking dependencies');

    const usesLerna = this.package.project.isLernaManaged();
    const workspacePackageNames = new Set(this.package.project.getWorkspacePackageNames());
    const {
      dependencies = {},
      devDependencies = {},
      peerDependencies = {},
      optionalDependencies = {},
    } = this.package.packageJson;

    this.checkDependencyRange(dependencies);
    this.checkDependencyRange(devDependencies);
    this.checkDependencyRange(peerDependencies);
    this.checkDependencyRange(optionalDependencies);

    Object.entries(peerDependencies).forEach(([peerName, versionConstraint]) => {
      const devVersion = semver.coerce(devDependencies[peerName]);
      const prodVersion = dependencies[peerName];

      if (prodVersion) {
        this.errors.push(`Dependency "${peerName}" defined as both a prod and peer dependency.`);
      }

      // Avoid further checks if constraint is special.
      if (versionConstraint.includes(':')) {
        return;
      }

      // When using Lerna, we want to avoid pairing a peer with a dev dependency,
      // as Lerna will update their `package.json` version of all dependent packages!
      // This would accidently publish many packages that shouldn't be.
      if (usesLerna && workspacePackageNames.has(peerName)) {
        if (devVersion) {
          this.errors.push(
            `Peer dependency "${peerName}" should not define a dev dependency when using Lerna.`,
          );
        }

        return;
      }

      if (!devVersion) {
        this.warnings.push(
          `Peer dependency "${peerName}" is missing a version satisfying dev dependency.`,
        );
      } else if (!semver.satisfies(devVersion.version, versionConstraint)) {
        this.errors.push(
          `Dev dependency "${peerName}" does not satisfy version constraint of its peer. Found ${devVersion.version}, requires ${versionConstraint}.`,
        );
      }
    });
  }

  protected checkDependencyRange(deps: DependencyMap) {
    Object.entries(deps).forEach(([depName, version]) => {
      if (version.startsWith('file:')) {
        this.errors.push(
          `Dependency "${depName}" must not require the file system. Found "file:" constraint.`,
        );
      } else if (version.startsWith('link:')) {
        this.errors.push(
          `Dependency "${depName}" must not require symlinks. Found "link:" constraint.`,
        );
      }
    });
  }

  protected async checkEngines() {
    this.package.debug('Checking engines');

    const { engines } = this.package.packageJson;
    const nodeConstraint = engines?.node;
    const npmConstraint = engines?.npm;
    const yarnConstraint = engines?.yarn;

    if (nodeConstraint) {
      const nodeVersion = semver.coerce(await this.getBinVersion('node'));

      if (nodeVersion && !semver.satisfies(nodeVersion.version, nodeConstraint)) {
        this.warnings.push(
          `Node.js does not satisfy engine constraints. Found ${nodeVersion.version}, requires ${nodeConstraint}.`,
        );
      }
    }

    if (npmConstraint) {
      const npmVersion = semver.coerce(await this.getBinVersion('npm'));

      if (npmVersion && !semver.satisfies(npmVersion.version, npmConstraint)) {
        this.warnings.push(
          `NPM does not satisfy engine constraints. Found ${npmVersion.version}, requires ${npmConstraint}.`,
        );
      }
    }

    if (yarnConstraint) {
      const yarnVersion = semver.coerce(await this.getBinVersion('yarn'));

      if (yarnVersion && !semver.satisfies(yarnVersion.version, yarnConstraint)) {
        this.warnings.push(
          `Yarn does not satisfy engine constraints. Found ${yarnVersion.version}, requires ${yarnConstraint}.`,
        );
      }
    }
  }

  protected checkEntryPoints() {
    this.package.debug('Checking entry points');

    const { bin, man, exports: exp } = this.package.packageJson;

    PackageValidator.entryPoints.forEach((field) => {
      const relPath = this.package.packageJson[field as 'main'];

      if (!relPath || typeof relPath !== 'string') {
        if (field === 'main' && !exp) {
          this.errors.push('Missing primary entry point. Provide a `main` or `exports` field.');
        }

        return;
      }

      if (!this.doesPathExist(relPath)) {
        this.errors.push(`Entry point "${field}" resolves to an invalid or missing file.`);
      }
    });

    if (isObject(bin)) {
      Object.entries(bin).forEach(([name, path]) => {
        if (!this.doesPathExist(path)) {
          this.errors.push(`Bin "${name}" resolves to an invalid or missing file.`);
        }
      });
    }

    if (Array.isArray(man)) {
      man.forEach((path) => {
        if (!this.doesPathExist(path)) {
          this.errors.push(`Manual "${path}" resolves to an invalid or missing file.`);
        }
      });
    }
  }

  protected async checkIgnoredFiles() {
    const npmignorePath = this.package.path.append('.npmignore');
    const gitignorePath = this.package.path.append('.gitignore');
    const ignoreList = ignore({ ignorecase: true }).add([
      '.DS_Store',
      '.git',
      '.npmrc',
      '.svn',
      '.yarnrc',
      'node_modules',
      'npm-debug.log',
      'yarn-debug.log',
      'package-lock.json',
    ]);

    if (npmignorePath.exists()) {
      ignoreList.add(await this.loadIgnoreFile(npmignorePath));
    } else if (gitignorePath.exists()) {
      ignoreList.add(await this.loadIgnoreFile(gitignorePath));
    } else {
      return;
    }
  }

  protected checkLicense() {
    this.package.debug('Checking license');

    const { license } = this.package.packageJson;
    const spdxLicenseTypes = new Set(
      Object.keys(spdxLicenses).map((key) => key.toLocaleLowerCase()),
    );

    if (license) {
      toArray(
        typeof license === 'string' ? { type: license, url: spdxLicenses[license] } : license,
      ).forEach((l) => {
        if (!spdxLicenseTypes.has(l.type.toLocaleLowerCase())) {
          this.errors.push(`Invalid license "${l.type}". Must be an official SPDX license type.`);
        }
      });
    } else {
      this.errors.push('Missing license.');
    }

    if (!this.doesPathExist('LICENSE') && !this.doesPathExist('LICENSE.md')) {
      this.errors.push(
        'No license file found in package. Must contain one of LICENSE or LICENSE.md.',
      );
    }
  }

  protected async checkLinks() {
    this.package.debug('Checking links');

    const { bugs, homepage } = this.package.packageJson;
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
    this.package.debug('Checking metadata');

    const { name, version, description, keywords, private: isPrivate } = this.package.packageJson;

    if (!name) {
      this.errors.push('Missing name.');
    } else if (!isModuleName(name)) {
      this.errors.push('Invalid name format. Must contain alphanumeric characters and dashes.');
    }

    // Only validate name when a private package
    if (isPrivate) {
      return;
    }

    if (!version) {
      this.errors.push('Missing version.');
    }

    if (!description) {
      this.warnings.push('Missing description.');
    }

    if (!keywords || keywords.length === 0) {
      this.warnings.push('Missing keywords.');
    }

    if (!this.doesPathExist('README') && !this.doesPathExist('README.md')) {
      this.errors.push('No read me found in package. Must contain one of README or README.md.');
    }
  }

  protected async checkPeople() {
    this.package.debug('Checking author and contributors');

    const { author, contributors } = this.package.packageJson;

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
    this.package.debug('Checking repository');

    const repo = this.package.packageJson.repository;
    const url = isObject(repo) ? repo.url : repo;

    if (!url) {
      this.errors.push('Missing repository.');
    } else if (url.startsWith('http')) {
      if (!(await this.doesUrlExist(url))) {
        this.warnings.push('Repository is invalid. URL is either malformed or upstream is down.');
      }
    }

    if (isObject(repo)) {
      const dir = repo.directory;

      if (dir && !this.package.project.root.append(dir).exists()) {
        this.errors.push(`Repository directory "${dir}" does not exist.`);
      }
    }
  }

  protected doesPathExist(path: string): boolean {
    return this.package.path.append(path).exists();
  }

  // istanbul ignore next
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

  protected async findDistributableFiles(): Promise<string[]> {
    const patterns: string[] = ['LICENSE', 'LICENSE.md', 'README', 'README.md'];

    FORMATS.forEach((format) => {
      patterns.push(`${format}/**/*`);
    });

    return glob(patterns, { cwd: this.package.path.path(), ignore: ['node_modules'] });
  }

  protected async getBinVersion(bin: string): Promise<string> {
    try {
      return (await execa(bin, ['-v'], { preferLocal: true })).stdout.trim();
    } catch {
      // istanbul ignore next
      return '';
    }
  }

  protected async loadIgnoreFile(path: Path): Promise<string[]> {
    const contents = await fs.readFile(path.path(), 'utf8');

    return contents.split('\n').filter((line) => line !== '' && !line.startsWith('#'));
  }
}
