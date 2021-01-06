import path from 'path';
import { ModuleFormat, OutputOptions, RollupOptions } from 'rollup';
import externals from 'rollup-plugin-node-externals';
import visualizer from 'rollup-plugin-visualizer';
import { getBabelInputPlugin, getBabelOutputPlugin } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { getBabelInputConfig, getBabelOutputConfig } from '../babel/config';
import type BundleArtifact from '../BundleArtifact';
import { EXCLUDE, EXTENSIONS } from '../constants';
import { BundleBuild, FeatureFlags, Format } from '../types';

const sharedPlugins = [resolve({ extensions: EXTENSIONS, preferBuiltins: true }), commonjs()];

function getRollupModuleFormat(format: Format): ModuleFormat {
  if (
    format === 'esm' ||
    format === 'mjs' ||
    // UMD needs to be compiled with Babel instead of Rollup,
    // so we use ESM for better interoperability.
    format === 'umd'
  ) {
    return 'esm';
  }

  return 'cjs';
}

function getRollupExternalPaths(artifact: BundleArtifact, ext?: string): Record<string, string> {
  const paths: Record<string, string> = {};

  artifact.package.artifacts.forEach((art) => {
    const bundle = art as BundleArtifact;

    // Don't include non-bundle artifacts. We can't use `instanceof`
    // because of circular dependencies, boo!
    if ('outputName' in bundle) {
      // All output files are in the same directory, so we can hard-code a relative path
      paths[bundle.getInputPath().path()] = `./${bundle.outputName}${ext ? `.${ext}` : ''}`;
    }
  });

  return paths;
}

export function getRollupOutputConfig(
  artifact: BundleArtifact,
  features: FeatureFlags,
  build: BundleBuild,
): OutputOptions {
  const { format, platform, support } = build;
  const name = artifact.outputName;
  const ext = artifact.getOutputExtension(format);
  const output: OutputOptions = {
    dir: artifact.getOutputFolderPath(format).path(),
    format: getRollupModuleFormat(format),
    originalFormat: format,
    // Map our externals to local paths with trailing extension
    paths: getRollupExternalPaths(artifact, ext),
    // Use our extension for file names
    assetFileNames: '../assets/[name]-[hash][extname]',
    chunkFileNames: `${name}-[hash].${ext}`,
    entryFileNames: `${name}.${ext}`,
    // Use const when not supporting new targets
    preferConst: support === 'current' || support === 'experimental',
    // Output specific plugins
    plugins: [
      getBabelOutputPlugin({
        ...getBabelOutputConfig(build, features),
        filename: artifact.package.path.path(),
        // Provide a custom name for the UMD global
        moduleId: format === 'umd' ? artifact.namespace : undefined,
        // Maps are extracted above before transformation
        sourceMaps: false,
      }),
    ],
    // Only enable source maps for browsers
    sourcemap: Boolean(features.analyze) || platform !== 'node',
    sourcemapExcludeSources: true,
  };

  // Disable warnings about default exports
  if (format === 'lib' || format === 'cjs') {
    output.exports = 'auto';
  }

  // Automatically prepend a shebang for binaries
  if (artifact.outputName === 'bin') {
    output.banner = '#!/usr/bin/env node\n';
  }

  return output;
}

export function getRollupConfig(artifact: BundleArtifact, features: FeatureFlags): RollupOptions {
  const inputPath = artifact.getInputPath();
  const packagePath = path.resolve(artifact.package.packageJsonPath.path());

  const config: RollupOptions = {
    cache: artifact.cache,
    external: Object.keys(getRollupExternalPaths(artifact)),
    input: inputPath.path(),
    output: [],
    // Shared output plugins
    plugins: [
      // Mark all dependencies in `package.json` as external
      externals({
        builtins: true,
        deps: true,
        devDeps: true,
        optDeps: true,
        packagePath,
        peerDeps: true,
      }),
      // Externals MUST be listed before shared plugins
      ...sharedPlugins,
      // Declare Babel here so we can parse TypeScript/Flow
      getBabelInputPlugin({
        ...getBabelInputConfig(artifact, features),
        babelHelpers: 'bundled',
        exclude: __TEST__ ? [] : EXCLUDE,
        extensions: EXTENSIONS,
        filename: artifact.package.path.path(),
        // Extract maps from the original source
        sourceMaps: true,
      }),
    ],
    // Always treeshake for smaller builds
    treeshake: true,
  };

  // Analyze the bundle for debugging purposes
  if (features.analyze) {
    config.plugins!.push(
      visualizer({
        filename: artifact.getStatsFileName(),
        gzipSize: true,
        open: true,
        sourcemap: true,
        template: features.analyze,
        title: artifact.getStatsTitle(),
      }),
    );
  }

  // Add an output for each format
  config.output = artifact.builds.map((build) => getRollupOutputConfig(artifact, features, build));

  return config;
}
