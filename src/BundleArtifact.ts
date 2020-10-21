import { isObject, Path, SettingMap, toArray } from '@boost/common';
import { createDebugger } from '@boost/debug';
import { rollup, RollupCache } from 'rollup';
import Artifact from './Artifact';
import { NODE_SUPPORTED_VERSIONS, NPM_SUPPORTED_VERSIONS } from './constants';
import { getRollupConfig } from './rollup/config';
import { Format, PackemonOptions, Platform } from './types';

const debug = createDebugger('packemon:bundle');

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
    debug('Building %s bundle artifact with Rollup', this.outputName);

    const { output = [], ...input } = getRollupConfig(this, this.package.getFeatureFlags());
    const bundle = await rollup(input);

    if (bundle.cache) {
      this.cache = bundle.cache;
    }

    await Promise.all(
      toArray(output).map(async (out) => {
        const { originalFormat = 'lib', ...outOptions } = out;

        debug('\tWriting %s output', originalFormat);

        const result = await bundle.write(outOptions);

        this.result.stats[originalFormat] = {
          size: Buffer.byteLength(result.output[0].code),
        };
      }),
    );
  }

  postBuild({ addEngines, addExports }: PackemonOptions): void {
    this.addEntryPointsToPackageJson();

    if (addEngines) {
      this.addEnginesToPackageJson();
    }

    if (addExports) {
      this.addExportsToPackageJson();
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

  toString() {
    return `bundle:${this.getLabel()} (${this.getTargets().join(', ')})`;
  }

  protected addEnginesToPackageJson() {
    const { platforms, support } = this.package.config;
    const pkg = this.package.packageJson;

    if (!platforms.includes('node')) {
      return;
    }

    debug('Adding `engines` to %s `package.json`', this.package.getName());

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

  protected addEntryPointsToPackageJson() {
    debug('Adding entry points to %s `package.json`', this.package.getName());

    const pkg = this.package.packageJson;
    const formats = new Set(this.formats);

    if (this.outputName === 'index') {
      if (formats.has('lib')) {
        pkg.main = './lib/index.js';
      } else if (formats.has('cjs')) {
        pkg.main = './cjs/index.js';
      }

      if (formats.has('esm')) {
        pkg.module = './esm/index.js';
      }

      if (formats.has('umd')) {
        pkg.browser = './umd/index.js';
      }
    }

    // Bin field may be an object
    if (this.outputName === 'bin' && !isObject(pkg.bin)) {
      if (formats.has('lib')) {
        pkg.bin = './lib/bin.js';
      } else if (formats.has('cjs')) {
        pkg.bin = './cjs/bin.js';
      }
    }
  }

  protected addExportsToPackageJson() {
    debug('Adding `exports` to %s `package.json`', this.package.getName());

    const pkg = this.package.packageJson;
    const paths: SettingMap = {};

    if (!pkg.exports) {
      pkg.exports = {};
    }

    this.formats.forEach((format) => {
      const path = this.getOutputFile(format);

      if (format === 'mjs' || format === 'esm') {
        paths.import = path;
      } else if (format === 'cjs') {
        paths.require = path;
      }
    });

    // Must come after import/require
    if (this.formats.includes('lib')) {
      paths.default = this.getOutputFile('lib');
    }

    Object.assign(pkg.exports, {
      './package.json': './package.json',
      [this.outputName === 'index' ? '.' : `./${this.outputName}`]: paths,
    });
  }
}
