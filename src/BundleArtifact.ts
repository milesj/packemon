import { Path, SettingMap, toArray } from '@boost/common';
import { rollup, RollupCache } from 'rollup';
import Artifact from './Artifact';
import { getRollupConfig } from './configs/rollup';
import { Format, PackOptions, Platform } from './types';

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
    const rollupConfig = getRollupConfig(this, this.package.getFeatureFlags());

    // Skip build because of invalid config
    if (!rollupConfig) {
      this.state = 'skipped';

      return;
    }

    this.result = {
      stats: {},
      time: 0,
    };

    const { output = [], ...input } = rollupConfig;
    const start = Date.now();
    const bundle = await rollup(input);

    if (bundle.cache) {
      this.cache = bundle.cache;
    }

    await Promise.all(
      toArray(output).map(async (out) => {
        const { originalFormat = 'lib', ...outOptions } = out;

        try {
          const result = await bundle.write(outOptions);

          this.result!.stats[originalFormat] = {
            size: Buffer.byteLength(result.output[0].code),
          };
        } catch (error) {
          this.state = 'failed';

          throw error;
        }
      }),
    );

    this.result.time = Date.now() - start;
  }

  pack({ addExports }: PackOptions): void {
    const pkg = this.package.contents;
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

    if (addExports) {
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

      if (!pkg.exports) {
        pkg.exports = {};
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

  getBuilds(): string[] {
    return this.formats;
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
      const platforms = new Set(this.package.platforms);

      if (platforms.has('browser')) {
        return 'browser';
      } else if (platforms.has('node')) {
        return 'node';
      }
    }

    return this.package.platforms[0];
  }

  getInputPath(): Path | null {
    const inputPath = this.package.path.append(this.inputPath);

    if (inputPath.exists()) {
      return inputPath;
    }

    console.warn(
      `Cannot find input "${this.inputPath}" for package "${this.package.getName()}".`,
      'Skipping package.',
    );

    return null;
  }

  getOutputFile(format: Format): string {
    const ext = format === 'cjs' || format === 'mjs' ? format : 'js';

    return `./${format}/${this.outputName}.${ext}`;
  }

  getOutputPath(format: Format): Path {
    return this.package.path.append(this.getOutputFile(format));
  }
}
