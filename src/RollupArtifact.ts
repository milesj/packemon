import { Path, toArray } from '@boost/common';
import { rollup, RollupCache } from 'rollup';
import Artifact from './Artifact';
import { getRollupConfig } from './configs/rollup';
import { BuildResult, Format, Platform, Target } from './types';

export default class RollupArtifact extends Artifact {
  cache?: RollupCache;

  formats: Format[] = [];

  // Path to the input file relative to the package
  inputPath: string = '';

  // Namespace for UMD bundles
  namespace: string = '';

  // Name of the output file without extension
  outputName: string = '';

  platforms: Platform[] = [];

  result?: BuildResult;

  target: Target = 'legacy';

  get name(): string {
    let { name } = this.package.contents;

    if (this.outputName !== 'index') {
      name += '/';
      name += this.outputName;
    }

    return name;
  }

  async build() {
    const rollupConfig = getRollupConfig(this, this.package.getFeatureFlags());

    // Skip build because of invalid config
    if (!rollupConfig) {
      this.status = 'skipped';

      return;
    }

    this.status = 'building';

    const { output = [], ...input } = rollupConfig;
    const bundle = await rollup(input);

    // Cache the build
    if (bundle.cache) {
      this.cache = bundle.cache;
    }

    // Write each build output
    const start = Date.now();

    this.result = {
      output: [],
      time: 0,
    };

    await Promise.all(
      toArray(output).map(async (out) => {
        const { originalFormat, ...outOptions } = out;

        try {
          await bundle.write(outOptions);

          this.status = 'passed';
        } catch (error) {
          this.status = 'failed';

          throw error;
        }

        this.result?.output.push({
          format: originalFormat!,
          path: out.file!,
        });
      }),
    );

    this.result.time = Date.now() - start;
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
      const platforms = new Set(this.platforms);

      if (platforms.has('browser')) {
        return 'browser';
      } else if (platforms.has('node')) {
        return 'node';
      }
    }

    return this.platforms[0];
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
