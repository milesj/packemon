import { Path, toArray } from '@boost/common';
import { rollup, RollupCache } from 'rollup';
import Artifact from './Artifact';
import { getRollupConfig } from './configs/rollup';
import { Format, Platform } from './types';

export default class RollupArtifact extends Artifact {
  cache?: RollupCache;

  formats: Format[] = [];

  // Path to the input file relative to the package
  inputPath: string = '';

  // Namespace for UMD bundles
  namespace: string = '';

  // Name of the output file without extension
  outputName: string = '';

  async build() {
    const rollupConfig = getRollupConfig(this, this.package.getFeatureFlags());

    // Skip build because of invalid config
    if (!rollupConfig) {
      this.status = 'skipped';

      return;
    }

    this.status = 'building';
    this.result = {
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
        const { originalFormat, ...outOptions } = out;

        try {
          await bundle.write(outOptions);

          this.status = 'passed';
        } catch (error) {
          this.status = 'failed';
        }
      }),
    );

    this.result.time = Date.now() - start;
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
      `Cannot find input "${this.inputPath}" for package "${this.package.contents.name}". Skipping package.`,
    );

    return null;
  }

  getOutputPath(format: Format): Path {
    const ext = format === 'cjs' || format === 'mjs' ? format : 'js';

    return this.package.path.append(`${format}/${this.outputName}.${ext}`);
  }
}
