import path from 'path';
import { Path } from '@boost/common';
import { RollupOptions, OutputOptions, ModuleFormat } from 'rollup';
import externals from 'rollup-plugin-node-externals';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { getBabelInputPlugin, getBabelOutputPlugin } from '@rollup/plugin-babel';
import getBabelConfig from './babel';
import Build from '../Build';
import { FeatureFlags, Format, BuildUnit } from '../types';
import { EXTENSIONS, EXCLUDE } from '../constants';
import getPlatformFromBuild from '../helpers/getPlatformFromBuild';

const sharedPlugins = [resolve({ extensions: EXTENSIONS }), json({ namedExports: false })];

function getInputFile(build: Build): Path | null {
  // eslint-disable-next-line no-restricted-syntax
  for (const ext of EXTENSIONS) {
    const entryPath = build.packagePath.append(`src/index${ext}`);

    if (entryPath.exists()) {
      return entryPath;
    }
  }

  console.warn(`Cannot find entry point for package "${build.package.name}". Skipping package.`);

  return null;
}

function getOutputFile(inputFile: string, format: Format): string {
  const outputFile = inputFile.replace('src/', `${format}/`);
  const ext = format === 'cjs' || format === 'mjs' ? format : 'js';

  return outputFile.replace(/\.(js|ts)x?$/iu, `.${ext}`);
}

function getModuleFormat(format: Format): ModuleFormat {
  if (format === 'umd') {
    return 'umd';
  }

  if (format === 'esm' || format === 'mjs') {
    return 'esm';
  }

  return 'cjs';
}

export default function getRollupConfig(
  build: Build,
  features: FeatureFlags,
): RollupOptions | null {
  const inputPath = getInputFile(build);

  if (!inputPath) {
    return null;
  }

  const input = build.root.relativeTo(inputPath).path();
  const config: RollupOptions = {
    cache: build.cache,
    input,
    output: [],
    // Shared output plugins
    plugins: [
      ...sharedPlugins,
      // Declare Babel here so we can parse TypeScript/Flow
      getBabelInputPlugin({
        ...getBabelConfig(build, null, features),
        babelHelpers: 'bundled',
        exclude: EXCLUDE,
        extensions: EXTENSIONS,
        filename: build.packagePath.path(),
      }),
      // Mark all dependencies in `package.json` as external
      externals({
        builtins: true,
        deps: true,
        devDeps: true,
        optDeps: true,
        packagePath: path.resolve(build.packagePath.append('package.json').path()),
        peerDeps: true,
      }),
    ],
    // Always treeshake for smaller builds
    treeshake: true,
  };

  // Add an output for each build format
  config.output = build.formats.map((format) => {
    const buildUnit: BuildUnit = {
      format,
      platform: getPlatformFromBuild(format, build),
      target: build.target,
    };

    const output: OutputOptions = {
      file: getOutputFile(input, format),
      format: getModuleFormat(format),
      originalFormat: format,
      // Use const when not supporting old targets
      preferConst: build.target !== 'legacy',
      // Output specific plugins
      plugins: [
        getBabelOutputPlugin({
          ...getBabelConfig(build, buildUnit, features),
          filename: build.packagePath.path(),
        }),
      ],
    };

    if (format === 'umd') {
      output.extend = true;
      output.name = build.meta.namespace;
      output.noConflict = true;
    }

    return output;
  });

  return config;
}
