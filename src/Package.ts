/* eslint-disable require-atomic-updates, no-param-reassign, @typescript-eslint/member-ordering */

import fs from 'fs-extra';
import ts from 'typescript';
import { Memoize, Path, toArray } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import Artifact from './Artifact';
import Project from './Project';
import {
  FeatureFlags,
  PackageConfig,
  BuildOptions,
  PackemonPackage,
  PackemonPackageConfig,
  TSConfigStructure,
} from './types';

export default class Package {
  readonly artifacts: Artifact[] = [];

  readonly configs: PackageConfig[] = [];

  readonly debug!: Debugger;

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
    this.debug = createDebugger(['packemon', 'package', this.getSlug()]);
  }

  addArtifact(artifact: Artifact): Artifact {
    this.artifacts.push(artifact);

    artifact.startup();

    return artifact;
  }

  async build(options: BuildOptions): Promise<void> {
    this.debug('Building artifacts');

    // Build artifacts in parallel
    await Promise.all(
      this.artifacts.map(async (artifact) => {
        const start = Date.now();

        try {
          artifact.state = 'building';

          await artifact.preBuild(options);
          await artifact.build(options);
          await artifact.postBuild(options);

          artifact.state = 'passed';
        } catch (error) {
          artifact.state = 'failed';

          throw error;
        } finally {
          artifact.buildResult.time = Date.now() - start;
        }
      }),
    );

    // Sync `package.json` in case it was modified
    await this.syncPackageJson();
  }

  async cleanup(): Promise<void> {
    this.debug('Cleaning build artifacts');

    await Promise.all(this.artifacts.map((artifact) => artifact.cleanup()));
  }

  getName(): string {
    return this.packageJson.name;
  }

  @Memoize()
  // eslint-disable-next-line complexity
  getFeatureFlags(): FeatureFlags {
    this.debug('Loading feature flags');

    const flags: FeatureFlags =
      this.root || !this.project.isWorkspacesEnabled()
        ? {}
        : this.project.rootPackage.getFeatureFlags();

    flags.workspaces = this.project.workspaces;

    // React
    if (this.hasDependency('react')) {
      flags.react = true;

      this.debug(' - React');
    }

    // TypeScript
    const tsConfig = this.tsconfigJson || this.project.rootPackage.tsconfigJson;

    if (
      this.project.rootPackage.hasDependency('typescript') ||
      this.hasDependency('typescript') ||
      tsConfig
    ) {
      flags.typescript = true;
      flags.decorators = Boolean(tsConfig?.options.experimentalDecorators);
      flags.strict = Boolean(tsConfig?.options.strict);

      this.debug(
        ' - TypeScript (%s, %s)',
        flags.strict ? 'strict' : 'non-strict',
        flags.decorators ? 'decorators' : 'non-decorators',
      );
    }

    // Flow
    const flowconfigPath = this.project.root.append('.flowconfig');

    if (
      this.project.rootPackage.hasDependency('flow-bin') ||
      this.hasDependency('flow-bin') ||
      flowconfigPath.exists()
    ) {
      flags.flow = true;

      this.debug(' - Flow');
    }

    return flags;
  }

  getSlug(): string {
    return this.path.name(true);
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

  setConfigs(configs: Required<PackemonPackageConfig>[]) {
    configs.forEach((config) => {
      const platforms = toArray(config.platform);
      const formats = new Set(toArray(config.format));

      if (formats.size === 0) {
        platforms.sort().forEach((platform) => {
          if (platform === 'native' || platform === 'node') {
            formats.add('lib');
          } else if (platform === 'browser') {
            formats.add('lib');
            formats.add('esm');

            if (config.namespace) {
              formats.add('umd');
            }
          }
        });
      }

      this.configs.push({
        formats: Array.from(formats),
        inputs: config.inputs,
        namespace: config.namespace,
        platforms,
        support: config.support,
      });
    });
  }

  async syncPackageJson() {
    await fs.writeJson(this.packageJsonPath.path(), this.packageJson, { spaces: 2 });
  }

  @Memoize()
  get tsconfigJson(): TSConfigStructure | undefined {
    const path = this.path.append('tsconfig.json');

    if (!path.exists()) {
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { config, error } = ts.readConfigFile(path.path(), (name) =>
      fs.readFileSync(name, 'utf8'),
    );

    if (error) {
      throw error;
    }

    const result = ts.parseJsonConfigFileContent(config, ts.sys, this.path.path(), {}, path.path());

    if (result.errors.length > 0) {
      throw result.errors[0];
    }

    return result;
  }
}
