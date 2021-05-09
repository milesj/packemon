/* eslint-disable require-atomic-updates, no-param-reassign, @typescript-eslint/member-ordering */

import glob from 'fast-glob';
import fs from 'fs-extra';
import { isObject, Memoize, optimal, PackageStructure, Path, toArray } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import { BundleArtifact } from './BundleArtifact';
import { FORMATS_BROWSER, FORMATS_NATIVE, FORMATS_NODE } from './constants';
import { loadModule } from './helpers/loadModule';
import { Project } from './Project';
import { packemonBlueprint } from './schemas';
import {
  BuildOptions,
  FeatureFlags,
  PackageConfig,
  PackageExportPaths,
  PackageExports,
  PackemonPackage,
  PackemonPackageConfig,
  TSConfigStructure,
} from './types';
import { TypesArtifact } from './TypesArtifact';

export class Package {
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

          await artifact.build(options);

          artifact.state = 'passed';
        } catch (error: unknown) {
          artifact.state = 'failed';

          throw error;
        } finally {
          artifact.buildResult.time = Date.now() - start;
        }
      }),
    );

    // Add package entry points based on artifacts
    this.addEntryPoints();

    // Add package `exports` based on artifacts
    if (options.addExports) {
      this.addExports();
    }

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
    if (this.project.rootPackage.hasDependency('react') || this.hasDependency('react')) {
      flags.react = true;

      this.debug(' - React');
    }

    // TypeScript
    const tsConfig = this.tsconfigJson ?? this.project.rootPackage.tsconfigJson;

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

  @Memoize()
  getSourceFiles(): string[] {
    return glob.sync('src/**/*.{js,jsx,ts,tsx}', {
      absolute: true,
      cwd: this.path.path(),
      onlyFiles: true,
    });
  }

  hasDependency(name: string): boolean {
    const pkg = this.packageJson;

    return Boolean(
      pkg.dependencies?.[name] ??
        pkg.devDependencies?.[name] ??
        pkg.peerDependencies?.[name] ??
        pkg.optionalDependencies?.[name],
    );
  }

  isComplete(): boolean {
    return this.artifacts.every((artifact) => artifact.isComplete());
  }

  isRunning(): boolean {
    return this.artifacts.some((artifact) => artifact.isRunning());
  }

  setConfigs(configs: PackemonPackageConfig[]) {
    configs.forEach((cfg) => {
      const config = optimal(cfg, packemonBlueprint, {
        name: this.getName(),
      });

      toArray(config.platform).forEach((platform) => {
        let { bundle } = config;
        let formats = [...toArray(config.format)];
        const isEmpty = formats.length === 0;

        switch (platform) {
          case 'native':
            if (isEmpty) {
              formats.push('lib');
            } else {
              formats = formats.filter((format) => (FORMATS_NATIVE as string[]).includes(format));
            }
            break;

          case 'node':
            if (cfg.bundle === undefined) {
              bundle = false;
            }

            if (isEmpty) {
              formats.push('lib');
            } else {
              formats = formats.filter((format) => (FORMATS_NODE as string[]).includes(format));
            }
            break;

          case 'browser':
          default:
            if (isEmpty) {
              formats.push('lib', 'esm');

              if (config.namespace) {
                formats.push('umd');
              }
            } else {
              formats = formats.filter((format) => (FORMATS_BROWSER as string[]).includes(format));
            }
            break;
        }

        if (!bundle && Object.keys(config.inputs).length > 1) {
          throw new Error('Only 1 `inputs` can be defined when `bundle` is false.');
        }

        this.configs.push({
          bundle,
          formats,
          inputs: config.inputs,
          namespace: config.namespace,
          platform,
          support: config.support,
        });
      });
    });
  }

  async syncPackageJson() {
    await fs.writeJson(this.packageJsonPath.path(), this.packageJson, { spaces: 2 });
  }

  @Memoize()
  get tsconfigJson(): TSConfigStructure | undefined {
    const tsconfigJsonPath = this.path.append('tsconfig.json');

    if (!tsconfigJsonPath.exists()) {
      return undefined;
    }

    const ts = loadModule(
      'typescript',
      'TypeScript is required for config loading.',
    ) as typeof import('typescript');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { config, error } = ts.readConfigFile(tsconfigJsonPath.path(), (name) =>
      fs.readFileSync(name, 'utf8'),
    );

    const host = {
      getCanonicalFileName: (fileName: string) => fileName,
      getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
      getNewLine: () => ts.sys.newLine,
    };

    // istanbul ignore next
    if (error) {
      throw new Error(ts.formatDiagnostic(error, host));
    }

    const result = ts.parseJsonConfigFileContent(
      config,
      ts.sys,
      this.path.path(),
      {},
      tsconfigJsonPath.path(),
    );

    // istanbul ignore next
    if (result.errors.length > 0) {
      throw new Error(ts.formatDiagnostics(result.errors, host));
    }

    return result;
  }

  protected addEntryPoints() {
    this.debug('Adding entry points to `package.json`');

    let mainEntry = '';
    let moduleEntry = '';
    let browserEntry = '';
    const files = new Set<string>(this.packageJson.files);

    // eslint-disable-next-line complexity
    this.artifacts.forEach((artifact) => {
      // Build files
      if (artifact instanceof BundleArtifact) {
        // Generate `main`, `module`, and `browser` fields
        if (artifact.outputName === 'index') {
          if (!mainEntry || artifact.platform === 'node') {
            mainEntry = artifact.findEntryPoint(['lib', 'cjs', 'mjs']);
          }

          if (!moduleEntry) {
            moduleEntry = artifact.findEntryPoint(['esm', 'mjs']);
          }

          // Only include when we share a lib with another platform
          if (!browserEntry && artifact.platform === 'browser' && artifact.sharedLib) {
            browserEntry = artifact.findEntryPoint(['lib']);
          }
        }

        // Generate `bin` field
        if (
          artifact.outputName === 'bin' &&
          artifact.platform === 'node' &&
          !isObject(this.packageJson.bin)
        ) {
          this.packageJson.bin = artifact.findEntryPoint(['lib', 'cjs', 'mjs']);
        }

        // Generate `files` list
        artifact.builds.forEach(({ format }) => {
          files.add(`${format}/**/*.{${artifact.getOutputMetadata(format).ext},map}`);
        });

        files.add(`src/**/*.{${this.getSourceFileExts(artifact.inputFile)}}`);
      }

      // Type declarations
      if (artifact instanceof TypesArtifact) {
        this.packageJson.types = './dts/index.d.ts';
        files.add('dts/**/*.d.ts');
      }
    });

    if (mainEntry) {
      this.packageJson.main = mainEntry;

      if (mainEntry.endsWith('mjs')) {
        this.packageJson.type = 'module';
      } else if (mainEntry.endsWith('cjs')) {
        this.packageJson.type = 'commonjs';
      }
    }

    if (moduleEntry) {
      this.packageJson.module = moduleEntry;
    }

    if (browserEntry && !isObject(this.packageJson.browser)) {
      this.packageJson.browser = browserEntry;
    }

    this.packageJson.files = [...files].sort();
  }

  protected addExports() {
    this.debug('Adding `exports` to `package.json`');

    const exportMap: PackageExports = {
      './package.json': './package.json',
    };

    const mapConditionsToPath = (basePath: string, conditions: PackageExportPaths | string) => {
      const path = basePath.replace('/index', '');

      if (!exportMap[path]) {
        exportMap[path] = {};
      }

      Object.assign(exportMap[path], conditions);
    };

    this.artifacts.forEach((artifact) => {
      if (artifact instanceof BundleArtifact) {
        mapConditionsToPath(`./${artifact.outputName}`, artifact.getPackageExports());
      }

      if (artifact instanceof TypesArtifact) {
        Object.entries(artifact.getPackageExports()).forEach(([path, conditions]) => {
          mapConditionsToPath(path, conditions);
        });
      }
    });

    if (isObject(this.packageJson.exports)) {
      Object.assign(this.packageJson.exports, exportMap);
    } else {
      this.packageJson.exports = exportMap as PackageStructure['exports'];
    }
  }

  protected getSourceFileExts(inputFile: string): string[] {
    const sourceExt = new Path(inputFile).ext(true);
    const exts: string[] = [sourceExt];

    if (sourceExt === 'js') {
      exts.push('jsx');
    } else if (sourceExt === 'jsx' || sourceExt === 'cjs') {
      exts.unshift('js');
    } else if (sourceExt === 'ts') {
      exts.push('tsx');
    } else if (sourceExt === 'tsx') {
      exts.unshift('ts');
    }

    exts.push('json');

    return exts;
  }
}
