import { rollup, RollupCache } from 'rollup';
import { Path, toArray } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Artifact } from './Artifact';
import { DEFAULT_FORMAT, NODE_SUPPORTED_VERSIONS, NPM_SUPPORTED_VERSIONS } from './constants';
import { getRollupConfig } from './rollup/config';
import {
  BuildOptions,
  CodeBuild,
  Format,
  InputMap,
  PackageExportPaths,
  Platform,
  Support,
} from './types';

export class CodeArtifact extends Artifact<CodeBuild> {
  bundle: boolean = true;

  cache?: RollupCache;

  // Config object in which inputs are grouped in
  configGroup: number = 0;

  // Mapping of output names to input paths
  inputs?: InputMap;

  // Namespace for UMD bundles
  namespace: string = '';

  // Platform code will run on
  platform: Platform = 'node';

  // Are multiple builds writing to the lib folder
  sharedLib: boolean = false;

  // Target version code will run in
  support: Support = 'stable';

  protected debug!: Debugger;

  startup() {
    this.debug = createDebugger(['packemon', 'bundle', this.package.getSlug(), this.getLabel()]);
  }

  async cleanup(): Promise<void> {
    this.debug('Cleaning bundle artifacts');

    // Visualizer stats
    await this.removeFiles([this.package.project.root.append(this.getStatsFileName())]);
  }

  async build(options: BuildOptions): Promise<void> {
    this.debug('Building bundle artifact with Rollup');

    const features = this.package.getFeatureFlags();

    if (options.analyze !== 'none') {
      features.analyze = options.analyze;
    }

    const { output = [], ...input } = getRollupConfig(this, features);
    const bundle = await rollup({
      ...input,
      onwarn: /* istanbul ignore next */ ({ id, loc = {}, message }) => {
        this.logWithSource(message, 'warn', {
          id: id && id !== loc.file ? id : undefined,
          output: this.getLabel(),
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
        const bundledCode = result.output.reduce(
          (code, chunk) => code + ('code' in chunk ? chunk.code : ''),
          '',
        );

        this.builds[index].stats = {
          size: Buffer.byteLength(bundledCode),
        };
      }),
    );

    if (options.addEngines) {
      this.addEnginesToPackageJson();
    }
  }

  getLabel(): string {
    return `${this.platform}:${this.support}:${this.getBuildTargets().join(',')}`;
  }

  getBuildOutput(format: Format, outputName: string = '') {
    const ext = format === 'cjs' || format === 'mjs' ? format : 'js';
    const folder = format === 'lib' && this.sharedLib ? `lib/${this.platform}` : format;
    const file = `${outputName}.${ext}`;
    const path = `./${folder}/${file}`;

    return {
      ext,
      file,
      folder,
      path,
    };
  }

  getBuildTargets(): string[] {
    return this.builds.map((build) => build.format);
  }

  getStatsFileName(): string {
    return `stats-${this.getStatsTitle().replace(/\//gu, '-')}.html`;
  }

  getStatsTitle(): string {
    return `${this.package.getName()}/${this.getLabel()}`;
  }

  toString() {
    return `code (${this.getLabel()})`;
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
