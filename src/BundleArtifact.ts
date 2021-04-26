import path from 'path';
import glob from 'fast-glob';
import fs from 'fs-extra';
import { rollup, RollupCache } from 'rollup';
import { transformFileAsync } from '@babel/core';
import { Path, toArray } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import { getBabelInputConfig, getBabelOutputConfig } from './babel/config';
import { DEFAULT_FORMAT, NODE_SUPPORTED_VERSIONS, NPM_SUPPORTED_VERSIONS } from './constants';
import { getRollupConfig } from './rollup/config';
import {
  BuildOptions,
  BundleBuild,
  FeatureFlags,
  Format,
  PackageExportPaths,
  Platform,
  Support,
} from './types';

export class BundleArtifact extends Artifact<BundleBuild> {
  bundle: boolean = true;

  cache?: RollupCache;

  // Config object in which inputs are grouped in
  configGroup: number = 0;

  // Input file path relative to the package root
  inputFile: string = '';

  // Namespace for UMD bundles
  namespace: string = '';

  // Output file name without extension
  outputName: string = '';

  // Platform code will run on
  platform: Platform = 'node';

  // Are multiple builds writing to the lib folder
  sharedLib: boolean = false;

  // Target version code will run in
  support: Support = 'stable';

  protected debug!: Debugger;

  startup() {
    this.debug = createDebugger(['packemon', 'bundle', this.package.getSlug(), this.outputName]);
  }

  async cleanup(): Promise<void> {
    this.debug('Cleaning bundle artifacts');

    // Visualizer stats
    await this.removeFiles([this.package.project.root.append(this.getStatsFileName())]);
  }

  async build(options: BuildOptions): Promise<void> {
    const features = this.package.getFeatureFlags();

    if (options.analyze !== 'none') {
      features.analyze = options.analyze;
    }

    await (this.bundle ? this.buildWithRollup(features) : this.buildWithBabel(features));

    if (options.addEngines) {
      this.addEnginesToPackageJson();
    }
  }

  async buildWithBabel(features: FeatureFlags): Promise<void> {
    this.debug('Building bundle artifact with Bable');

    const inputConfig = getBabelInputConfig(this, features);
    const packageRoot = this.package.path;
    const srcPath = packageRoot.append('src');
    const srcFiles = await glob('**/*.{js,jsx,ts,tsx}', {
      absolute: false,
      cwd: srcPath.path(),
      onlyFiles: true,
    });

    await Promise.all(
      this.builds.map(async (build, index) => {
        const outputConfig = getBabelOutputConfig(build, features);
        const config = {
          ...inputConfig,
          plugins: [...inputConfig.plugins!, ...outputConfig.plugins!],
          presets: [...outputConfig.presets!, ...inputConfig.presets!],
        };
        const buildPath = packageRoot.append(build.format);
        let combinedCode = '';

        await Promise.all(
          srcFiles.map(async (file) => {
            const result = await transformFileAsync(srcPath.append(file).path(), config);

            if (!result || !result.code) {
              return;
            }

            const outFile = buildPath
              .append(file)
              .path()
              .replace(/(jsx|ts|tsx)$/, 'js');

            await fs.ensureDir(path.dirname(outFile));

            if (result.map) {
              const map = {
                ...result.map,
                file: path.basename(outFile),
                sourcesContent: null,
              };

              await fs.writeFile(`${outFile}.map`, JSON.stringify(map), 'utf8');

              result.code += `\n//# sourceMappingURL=${path.basename(outFile)}.map`;
            }

            if (result.code) {
              combinedCode += result.code;
              await fs.writeFile(outFile, result.code, 'utf8');
            }
          }),
        );

        this.debug(' - Writing `%s` output', build.format);

        this.builds[index].stats = {
          size: Buffer.byteLength(combinedCode),
        };
      }),
    );
  }

  async buildWithRollup(features: FeatureFlags): Promise<void> {
    this.debug('Building bundle artifact with Rollup');

    const { output = [], ...input } = getRollupConfig(this, features);
    const bundle = await rollup({
      ...input,
      onwarn: /* istanbul ignore next */ ({ id, loc = {}, message }) => {
        this.logWithSource(message, 'warn', {
          id: id && id !== loc.file ? id : undefined,
          output: this.outputName,
          sourceColumn: loc.column,
          sourceFile: loc.file,
          sourceLine: loc.line,
        });
      },
    });

    if (bundle.cache) {
      this.cache = bundle.cache;
    }

    await Promise.all(
      toArray(output).map(async (out, index) => {
        const { originalFormat = DEFAULT_FORMAT, ...outOptions } = out;

        this.debug(' - Writing `%s` output', originalFormat);

        const result = await bundle.write(outOptions);

        this.builds[index].stats = {
          size: Buffer.byteLength(result.output[0].code),
        };
      }),
    );
  }

  findEntryPoint(formats: Format[]): string {
    for (const format of formats) {
      if (this.builds.some((build) => build.format === format)) {
        return this.getOutputMetadata(format).path;
      }
    }

    return '';
  }

  getLabel(): string {
    return this.outputName;
  }

  getBuildTargets(): string[] {
    return this.builds.map((build) => build.format);
  }

  getInputPath(): Path {
    const inputPath = this.package.path.append(this.inputFile);

    if (inputPath.exists()) {
      return inputPath;
    }

    throw new Error(
      `Cannot find input "${
        this.inputFile
      }" for package "${this.package.getName()}". Skipping package.`,
    );
  }

  getOutputMetadata(format: Format) {
    const ext = format === 'cjs' || format === 'mjs' ? format : 'js';
    const folder = format === 'lib' && this.sharedLib ? `lib/${this.platform}` : format;
    const file = `${this.outputName}.${ext}`;

    return {
      ext,
      file,
      folder,
      path: `./${folder}/${file}`,
    };
  }

  getPackageExports(): PackageExportPaths {
    const paths: PackageExportPaths = {};
    let libPath = '';

    this.builds.forEach(({ format }) => {
      const { path: filePath } = this.getOutputMetadata(format);

      if (format === 'mjs' || format === 'esm') {
        paths.import = filePath;
      } else if (format === 'cjs') {
        paths.require = filePath;
      } else if (format === 'lib') {
        libPath = filePath;
      }

      // Webpack and Rollup support
      if (format === 'esm') {
        paths.module = filePath;
      }
    });

    // Must come after import/require
    if (libPath) {
      paths.default = libPath;
    }

    return {
      [this.platform === 'native' ? 'react-native' : this.platform]:
        Object.keys(paths).length === 1 && libPath ? paths.default : paths,
    };
  }

  getStatsFileName(): string {
    return `stats-${this.getStatsTitle().replace(/\//gu, '-')}.html`;
  }

  getStatsTitle(): string {
    return `${this.package.getName()}/${this.outputName}`;
  }

  toString() {
    return `bundle:${this.getLabel()} (${this.getBuildTargets().join(', ')})`;
  }

  protected addEnginesToPackageJson() {
    const pkg = this.package.packageJson;

    if (this.platform === 'node') {
      this.debug('Adding `engines` to `package.json`');

      if (!pkg.engines) {
        pkg.engines = {};
      }

      Object.assign(pkg.engines, {
        node: `>=${NODE_SUPPORTED_VERSIONS[this.support]}`,
        npm: toArray(NPM_SUPPORTED_VERSIONS[this.support])
          .map((v) => `>=${v}`)
          .join(' || '),
      });
    }
  }
}
