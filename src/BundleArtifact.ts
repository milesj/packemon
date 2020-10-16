import { Path, SettingMap, toArray } from '@boost/common';
import { rollup, RollupCache } from 'rollup';
import Artifact from './Artifact';
import { NODE_SUPPORTED_VERSIONS, NPM_SUPPORTED_VERSIONS } from './constants';
import { getRollupConfig } from './rollup/config';
import { Format, PackemonOptions, Platform } from './types';

export default class BundleArtifact extends Artifact<{ size: number }> {
  cache?: RollupCache;

  formats: Format[] = [];

  // Path to the input file relative to the package
  inputPath: string = '';

  // Namespace for UMD bundles
  namespace: string = '';

  // Name of the output file without extension
  outputName: string = '';

  async build(): Promise<void> {
    const { output = [], ...input } = getRollupConfig(this, this.package.getFeatureFlags());
    const bundle = await rollup(input);

    if (bundle.cache) {
      this.cache = bundle.cache;
    }

    await Promise.all(
      toArray(output).map(async (out) => {
        const { originalFormat = 'lib', ...outOptions } = out;
        const result = await bundle.write(outOptions);

        this.result.stats[originalFormat] = {
          size: Buffer.byteLength(result.output[0].code),
        };
      }),
    );
  }

  // eslint-disable-next-line complexity
  postBuild({ addEngines, addExports }: PackemonOptions): void {
    const pkg = this.package.packageJson;
    const { platforms, support } = this.package.config;
    const hasLib = this.formats.includes('lib');
    const hasUmd = this.formats.includes('umd');

    if (this.outputName === 'index') {
      if (hasLib) {
        pkg.main = './lib/index.js';
      }

      if (hasUmd) {
        pkg.browser = './umd/index.js';
      }
    }

    if (this.outputName === 'bin') {
      if (hasLib && !pkg.bin) {
        pkg.bin = './lib/bin.js';
      }
    }

    if (addEngines && platforms.includes('node')) {
      if (!pkg.engines) {
        pkg.engines = {};
      }

      const npmVersion = NPM_SUPPORTED_VERSIONS[support];

      Object.assign(pkg.engines, {
        node: `>=${NODE_SUPPORTED_VERSIONS[support]}`,
        npm: toArray(npmVersion)
          .map((v) => `>=${v}`)
          .join(' || '),
      });
    }

    if (addExports) {
      if (!pkg.exports) {
        pkg.exports = {};
      }

      const paths: SettingMap = {};

      this.formats.forEach((format) => {
        const path = this.getOutputFile(format);

        if (format === 'mjs' || format === 'esm') {
          paths.import = path;
        } else if (format === 'cjs') {
          paths.require = path;
        }
      });

      // Must come after import/require
      if (hasLib) {
        paths.default = this.getOutputFile('lib');
      }

      Object.assign(pkg.exports, {
        './package.json': './package.json',
        [this.outputName === 'index' ? '.' : `./${this.outputName}`]: paths,
      });
    }
  }

  getLabel(): string {
    return this.outputName;
  }

  getTargets(): string[] {
    return this.formats;
  }

  getExtension(format: Format): string {
    return format === 'cjs' || format === 'mjs' ? format : 'js';
  }

  getPlatform(format: Format): Platform {
    if (format === 'cjs' || format === 'mjs') {
      return 'node';
    }

    if (format === 'esm' || format === 'umd') {
      return 'browser';
    }

    // "lib" is a shared format across all platforms,
    // and when a package wants to support multiple platforms,
    // we must down-level the "lib" format to the lowest platform.
    if (this.flags.requiresSharedLib) {
      const platforms = new Set(this.package.config.platforms);

      if (platforms.has('browser')) {
        return 'browser';
      } else if (platforms.has('node')) {
        return 'node';
      }
    }

    return this.package.config.platforms[0];
  }

  getInputPath(): Path {
    const inputPath = this.package.path.append(this.inputPath);

    if (inputPath.exists()) {
      return inputPath;
    }

    throw new Error(
      `Cannot find input "${
        this.inputPath
      }" for package "${this.package.getName()}". Skipping package.`,
    );
  }

  getOutputFile(format: Format): string {
    return `./${format}/${this.outputName}.${this.getExtension(format)}`;
  }

  getOutputPath(format: Format): Path {
    return this.package.path.append(this.getOutputFile(format));
  }
}
