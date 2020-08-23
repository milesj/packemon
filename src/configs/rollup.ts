import path from 'path';
import { Path } from '@boost/common';
import { RollupOptions, RollupCache, OutputOptions, ModuleFormat } from 'rollup';
import externals from 'rollup-plugin-node-externals';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import getBabelConfig from './babel';
import { Build, FeatureFlags, PackemonPackage, Format, BuildUnit, Platform } from '../types';
import { EXTENSIONS, EXCLUDE } from '../constants';

const sharedPlugins = [resolve({ extensions: EXTENSIONS }), json({ namedExports: false })];

function getInputFile(packagePath: Path, pkg: PackemonPackage): string {
  // eslint-disable-next-line no-restricted-syntax
  for (const ext of EXTENSIONS) {
    const entryPath = packagePath.append(`src/index${ext}`);

    if (entryPath.exists()) {
      return entryPath.path();
    }
  }

  throw new Error(`Cannot find entry point for package "${pkg.name}".`);
}

function getOutputFile(inputFile: string, format: Format): string {
  const outputFile = inputFile.replace('/src/', `/${format}/`);
  const ext = format === 'cjs' || format === 'mjs' ? format : 'js';

  return outputFile.replace(/\.{ts,tsx,js,jsx}$/iu, `.${ext}`);
}

function getPlatformFromBuild(format: Format, build: Build): Platform {
  if (format === 'cjs' || format === 'mjs') {
    return 'node';
  }

  if (format === 'esm' || format === 'umd') {
    return 'browser';
  }

  // "lib" is a shared format across all platforms,
  // and when a package wants to support multiple platforms,
  // we must down-level the "lib" format to the lowest platform.
  if (build.flags.requiresSharedLib) {
    const platforms = new Set(build.platforms);

    if (platforms.has('browser')) {
      return 'browser';
    } else if (platforms.has('node')) {
      return 'node';
    }
  }

  return build.platforms[0] || 'browser';
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
  packagePath: Path, // Relative to cwd
  build: Build,
  features: FeatureFlags,
  cache?: RollupCache,
): RollupOptions {
  const input = getInputFile(packagePath, build.package);
  const config: RollupOptions = {
    cache,
    input,
    output: [],
    // Shared output plugins
    plugins: [
      // Mark all dependencies in `package.json` as external
      externals({
        builtins: true,
        deps: true,
        devDeps: true,
        optDeps: true,
        packagePath: path.resolve(packagePath.append('package.json').path()),
        peerDeps: true,
      }),
      ...sharedPlugins,
    ],
    // Always treeshake for smaller builds
    treeshake: true,
  };

  // Add an output for each build format
  build.formats.forEach((format) => {
    const buildUnit: BuildUnit = {
      format,
      platform: getPlatformFromBuild(format, build),
      target: build.target,
      workspaces: build.meta.workspaces,
    };

    const output: OutputOptions = {
      file: getOutputFile(input, format),
      format: getModuleFormat(format),
      // Use const when not supporting old targets
      preferConst: build.target !== 'legacy',
      // Output specific plugins
      plugins: [
        babel({
          ...getBabelConfig(buildUnit, features),
          babelHelpers: 'bundled',
          exclude: EXCLUDE,
          extensions: EXTENSIONS,
        }),
      ],
    };

    if (format === 'umd') {
      output.extend = true;
      output.name = build.meta.namespace;
      output.noConflict = true;
    }

    if (Array.isArray(config.output)) {
      config.output.push(output);
    }
  });

  return config;
}
