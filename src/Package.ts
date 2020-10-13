/* eslint-disable no-param-reassign, @typescript-eslint/member-ordering */

import fs from 'fs-extra';
import spdxLicenses from 'spdx-license-list';
import { Memoize, Path, toArray } from '@boost/common';
import Artifact from './Artifact';
import Project from './Project';
import resolveTsConfig from './helpers/resolveTsConfig';
import {
  ArtifactState,
  Awaitable,
  BootOptions,
  BuildOptions,
  FeatureFlags,
  PackemonPackage,
  PackOptions,
  Platform,
  Target,
} from './types';

export default class Package {
  artifacts: Artifact[] = [];

  contents: PackemonPackage;

  jsonPath: Path;

  path: Path;

  platforms: Platform[] = [];

  project: Project;

  root: boolean = false;

  target: Target = 'legacy';

  constructor(project: Project, path: Path, contents: PackemonPackage) {
    this.project = project;
    this.path = path;
    this.jsonPath = this.path.append('package.json');
    this.contents = contents;

    // Workspace root `package.json`s may not have this
    if (contents.packemon) {
      this.platforms = toArray(contents.packemon.platform || 'node');
      this.target = contents.packemon.target || 'legacy';
    }
  }

  addArtifact(artifact: Artifact): Artifact {
    this.artifacts.push(artifact);

    return artifact;
  }

  async boot(options: BootOptions): Promise<void> {
    if (options.checkLicenses) {
      this.checkLicense();
    }

    await this.processArtifacts('booting', (artifact) => artifact.boot(options));
  }

  async build(options: BuildOptions): Promise<void> {
    await this.processArtifacts('building', (artifact) => artifact.build(options));
  }

  async pack(options: PackOptions): Promise<void> {
    await this.processArtifacts('packing', (artifact) => artifact.pack(options));
    await this.syncJsonFile();
  }

  async complete(): Promise<void> {
    await this.processArtifacts('passed');
  }

  getName(): string {
    return this.contents.name;
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
    const tsconfigPath = this.project.root.append('tsconfig.json');

    if (this.hasDependency('typescript') || tsconfigPath.exists()) {
      flags.typescript = true;
      flags.decorators = Boolean(
        resolveTsConfig(tsconfigPath)?.compilerOptions?.experimentalDecorators,
      );
    }

    // Flow
    const flowconfigPath = this.project.root.append('.flowconfig');

    if (this.hasDependency('flow-bin') || flowconfigPath.exists()) {
      flags.flow = true;
    }

    return flags;
  }

  hasDependency(name: string): boolean {
    const pkg = this.contents;

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

  protected async processArtifacts(
    state: ArtifactState,
    callback?: (artifact: Artifact) => Awaitable,
  ) {
    await Promise.all(
      this.artifacts
        .filter((artifact) => !artifact.shouldSkip())
        .map(async (artifact) => {
          artifact.state = state;

          if (callback) {
            await callback(artifact);
          }
        }),
    );
  }

  protected async syncJsonFile() {
    await fs.writeJson(this.jsonPath.path(), this.contents, { spaces: 2 });
  }
}
