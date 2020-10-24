import { isObject, Path, SettingMap, toArray } from '@boost/common';
import { createDebugger } from '@boost/debug';
import { rollup, RollupCache } from 'rollup';
import Artifact from './Artifact';
import { NODE_SUPPORTED_VERSIONS, NPM_SUPPORTED_VERSIONS } from './constants';
import { getRollupConfig } from './rollup/config';
import { Format, BuildOptions, BundleBuild, Support, Platform } from './types';

const debug = createDebugger('packemon:bundle');

export default class BundleArtifact extends Artifact<BundleBuild> {
  cache?: RollupCache;

  // Path to the input file relative to the package
  inputPath: string = '';

  // Namespace for UMD bundles
  namespace: string = '';

  // Name of the output file without extension
  outputName: string = '';

  static generateBuild(
    format: Format,
    support: Support,
    platforms: Platform[],
    requiresSharedLib: boolean,
  ): BundleBuild {
    let platform: Platform = 'browser';

    // Platform is dependent on the format
    if (format === 'cjs' || format === 'mjs') {
      platform = 'node';
    } else if (requiresSharedLib) {
      // "lib" is a shared format across all platforms,
      // and when a package wants to support multiple platforms,
      // we must down-level the "lib" format to the lowest platform.
      if (platforms.includes('browser')) {
        platform = 'browser';
      } else if (platforms.includes('node')) {
        platform = 'node';
      }
    }

    return {
      format,
      platform,
      support,
    };
  }

  async build(): Promise<void> {
    debug('Building %s bundle artifact with Rollup', this.outputName);

    const { output = [], ...input } = getRollupConfig(this, this.package.getFeatureFlags());
    const bundle = await rollup({
      ...input,
      onwarn: ({ id, loc = {}, message }) => {
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
        const { originalFormat = 'lib', ...outOptions } = out;

        debug('\tWriting %s output', originalFormat);

        const result = await bundle.write(outOptions);

        this.builds[index].stats = {
          size: Buffer.byteLength(result.output[0].code),
        };
      }),
    );
  }

  postBuild({ addEngines, addExports }: BuildOptions): void {
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

  getBuildTargets(): string[] {
    return this.builds.map((build) => build.format);
  }

  getExtension(format: Format): string {
    return format === 'cjs' || format === 'mjs' ? format : 'js';
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

  getOutputDir(format: Format): Path {
    return this.package.path.append(format);
  }

  toString() {
    return `bundle:${this.getLabel()} (${this.getBuildTargets().join(', ')})`;
  }

  protected addEnginesToPackageJson() {
    debug('Adding `engines` to %s `package.json`', this.package.getName());

    const pkg = this.package.packageJson;

    if (!pkg.engines) {
      pkg.engines = {};
    }

    // Update with the lowest supported node version
    const supportRanks: Record<Support, number> = {
      legacy: 1,
      stable: 2,
      current: 3,
      experimental: 4,
    };

    const nodeBuild = [...this.builds]
      .sort((a, b) => supportRanks[a.support] - supportRanks[b.support])
      .find((build) => build.platform === 'node');

    if (nodeBuild) {
      Object.assign(pkg.engines, {
        node: `>=${NODE_SUPPORTED_VERSIONS[nodeBuild.support]}`,
        npm: toArray(NPM_SUPPORTED_VERSIONS[nodeBuild.support])
          .map((v) => `>=${v}`)
          .join(' || '),
      });
    }
  }

  protected addEntryPointsToPackageJson() {
    debug('Adding entry points to %s `package.json`', this.package.getName());

    const pkg = this.package.packageJson;

    this.builds.forEach(({ format }) => {
      if (this.outputName === 'index') {
        if (format === 'lib' || format === 'cjs') {
          pkg.main = `./${format}/index.js`;
        } else if (format === 'esm') {
          pkg.module = './esm/index.js';
        } else if (format === 'umd') {
          pkg.browser = './umd/index.js';
        }
      }

      // Bin field may be an object
      if (this.outputName === 'bin' && !isObject(pkg.bin)) {
        if (format === 'lib' || format === 'cjs') {
          pkg.bin = `./${format}/bin.js`;
        }
      }
    });
  }

  protected addExportsToPackageJson() {
    debug('Adding `exports` to %s `package.json`', this.package.getName());

    const pkg = this.package.packageJson;
    const paths: SettingMap = {};

    if (!pkg.exports) {
      pkg.exports = {};
    }

    let hasLib = false;

    this.builds.forEach(({ format }) => {
      const path = this.getOutputFile(format);

      if (format === 'mjs' || format === 'esm') {
        paths.import = path;
      } else if (format === 'cjs') {
        paths.require = path;
      } else if (format === 'lib') {
        hasLib = true;
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
