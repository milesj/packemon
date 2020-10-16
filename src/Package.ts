/* eslint-disable @typescript-eslint/member-ordering */

import fs from 'fs-extra';
import ts from 'typescript';
import spdxLicenses from 'spdx-license-list';
import { Memoize, Path, toArray } from '@boost/common';
import Artifact from './Artifact';
import Project from './Project';
import {
  FeatureFlags,
  PackageConfig,
  PackemonOptions,
  PackemonPackage,
  PackemonPackageConfig,
} from './types';

export default class Package {
  readonly artifacts: Artifact[] = [];

  config!: PackageConfig;

  readonly packageJson: PackemonPackage;

  readonly packageJsonPath: Path;

  readonly path: Path;

  readonly project: Project;

  root: boolean = false;

  constructor(project: Project, path: Path, contents: PackemonPackage) {
    this.project = project;
    this.path = path;
    this.packageJsonPath = this.path.append('package.json');
    this.packageJson = contents;
  }

  @Memoize()
  get tsconfigJson(): ts.ParsedCommandLine | null {
    const path = this.path.append('tsconfig.json');

    if (!path.exists()) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { config, error } = ts.readConfigFile(path.path(), (name) =>
      fs.readFileSync(name, 'utf8'),
    );

    if (error) {
      throw error;
    }

    const json = ts.parseJsonConfigFileContent(
      config,
      ts.sys,
      path.parent().path(),
      {},
      path.path(),
    );

    if (json.errors.length > 0) {
      throw json.errors[0];
    }

    return json;
  }

  addArtifact(artifact: Artifact): Artifact {
    this.artifacts.push(artifact);

    return artifact;
  }

  setConfig(config: Required<PackemonPackageConfig>) {
    this.config = {
      formats: toArray(config.format),
      inputs: config.inputs,
      namespace: config.namespace,
      platforms: toArray(config.platform),
      support: config.support,
    };
  }

  async run(options: PackemonOptions): Promise<void> {
    if (options.checkLicenses) {
      this.checkLicense();
    }

    // Process artifacts in parallel
    await Promise.all(this.artifacts.map((artifact) => artifact.run(options)));

    // Sync `package.json` in case it was modified
    await this.syncPackageJson();
  }

  getName(): string {
    return this.packageJson.name;
  }

  @Memoize()
  getFeatureFlags(): FeatureFlags {
    const flags: FeatureFlags = this.root ? {} : this.project.rootPackage.getFeatureFlags();

    flags.workspaces = this.project.workspaces;

    // React
    if (this.hasDependency('react')) {
      flags.react = true;
    }

    // TypeScript
    const tsConfig = this.tsconfigJson;

    if (this.hasDependency('typescript') && tsConfig) {
      flags.typescript = true;
      flags.decorators = Boolean(tsConfig.options.experimentalDecorators);
      flags.strict = Boolean(tsConfig.options.strict);
    }

    // Flow
    const flowconfigPath = this.project.root.append('.flowconfig');

    if (this.hasDependency('flow-bin') || flowconfigPath.exists()) {
      flags.flow = true;
    }

    return flags;
  }

  hasDependency(name: string): boolean {
    const pkg = this.packageJson;

    return Boolean(
      pkg.dependencies?.[name] ||
        pkg.devDependencies?.[name] ||
        pkg.peerDependencies?.[name] ||
        pkg.optionalDependencies?.[name],
    );
  }

  isComplete(): boolean {
    return this.artifacts.every((artifact) => artifact.isComplete());
  }

  isRunning(): boolean {
    return this.artifacts.some((artifact) => artifact.isRunning());
  }

  protected checkLicense() {
    const { packageJson: contents } = this;
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
          console.error(
            `Invalid license ${license.type} for package "${this.getName()}".`,
            'Must be an official SPDX license type.',
          );
        }
      });
    } else {
      console.error(`No license found for package "${this.getName()}".`);
    }
  }

  protected async syncPackageJson() {
    await fs.writeJson(this.packageJsonPath.path(), this.packageJson, { spaces: 2 });
  }
}
