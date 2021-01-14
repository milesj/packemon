import { rollup, RollupCache } from 'rollup';
import hash from 'string-hash';
import { isObject, Path, SettingMap, toArray } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import Artifact from './Artifact';
import { DEFAULT_FORMAT, NODE_SUPPORTED_VERSIONS, NPM_SUPPORTED_VERSIONS } from './constants';
import { supportRanks } from './helpers/getLowestSupport';
import { getRollupConfig } from './rollup/config';
import { BuildOptions, BundleBuild, Format, Platform, Support } from './types';

export default class BundleArtifact extends Artifact<BundleBuild> {
  cache?: RollupCache;

  // Input file path relative to the package root
  inputFile: string = '';

  // Namespace for UMD bundles
  namespace: string = '';

  // Output file name without extension
  outputName: string = '';

  protected debug!: Debugger;

  static generateBuild(format: Format, support: Support, platforms: Platform[]): BundleBuild {
    let platform: Platform = platforms[0] || 'browser';

    if (format === 'cjs' || format === 'mjs') {
      platform = 'node';
    } else if (format === 'esm' || format === 'umd') {
      platform = 'browser';
    }

    return {
      format,
      platform,
      support,
    };
  }

  startup() {
    this.debug = createDebugger(['packemon', 'bundle', this.package.getSlug(), this.outputName]);
  }

  async cleanup(): Promise<void> {
    this.debug('Cleaning bundle artifacts');

    // Visualizer stats
    await this.removeFiles([this.package.project.root.append(this.getStatsFileName())]);
  }

  async build(options: BuildOptions): Promise<void> {
    this.debug('Building bundle artifact with Rollup');

    const features = this.package.getFeatureFlags();

    if (options.analyzeBundle !== 'none') {
      features.analyze = options.analyzeBundle;
    }

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

  getOutputExtension(format: Format): string {
    return format === 'cjs' || format === 'mjs' ? format : 'js';
  }

  getOutputFile(format: Format): string {
    return `./${format}/${this.outputName}.${this.getOutputExtension(format)}`;
  }

  getOutputFolderPath(format: Format): Path {
    return this.package.path.append(format);
  }

  getStatsFileName(): string {
    return `stats-${hash(this.getStatsTitle()).toString(16)}.html`;
  }

  getStatsTitle(): string {
    return `${this.package.getName()}/${this.outputName}`;
  }

  toString() {
    return `bundle:${this.getLabel()} (${this.getBuildTargets().join(', ')})`;
  }

  protected addEnginesToPackageJson() {
    const pkg = this.package.packageJson;

    // Update with the lowest supported node version
    const nodeBuild = [...this.builds]
      .sort((a, b) => supportRanks[a.support] - supportRanks[b.support])
      .find((build) => build.platform === 'node');

    if (nodeBuild) {
      this.debug('Adding `engines` to `package.json`');

      if (!pkg.engines) {
        pkg.engines = {};
      }

      Object.assign(pkg.engines, {
        node: `>=${NODE_SUPPORTED_VERSIONS[nodeBuild.support]}`,
        npm: toArray(NPM_SUPPORTED_VERSIONS[nodeBuild.support])
          .map((v) => `>=${v}`)
          .join(' || '),
      });
    }
  }

  protected addEntryPointsToPackageJson() {
    this.debug('Adding entry points to `package.json`');

    const pkg = this.package.packageJson;

    this.builds.forEach(({ format }) => {
      const ext = this.getOutputExtension(format);
      const isNode = format === 'lib' || format === 'cjs' || format === 'mjs';

      if (this.outputName === 'index') {
        if (isNode) {
          pkg.main = `./${format}/index.${ext}`;
        } else if (format === 'esm') {
          pkg.module = `./esm/index.${ext}`;
        } else if (format === 'umd') {
          pkg.browser = `./umd/index.${ext}`;
        }
      }

      // Bin field may be an object
      if (this.outputName === 'bin' && !isObject(pkg.bin)) {
        if (isNode) {
          pkg.bin = `./${format}/bin.${ext}`;
        }
      }
    });
  }

  protected addExportsToPackageJson() {
    const pkg = this.package.packageJson;
    const paths: SettingMap = {};
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

    const exportCount = Object.keys(paths).length;

    if (exportCount > 0) {
      this.debug('Adding `exports` to `package.json`');

      if (!pkg.exports) {
        pkg.exports = {};
      }

      Object.assign(pkg.exports, {
        './package.json': './package.json',
        [this.outputName === 'index' ? '.' : `./${this.outputName}`]:
          exportCount === 1 && hasLib ? paths.default : paths,
      });
    }
  }
}
