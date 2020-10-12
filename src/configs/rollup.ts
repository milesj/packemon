import path from 'path';
import { RollupOptions, OutputOptions, ModuleFormat } from 'rollup';
import externals from 'rollup-plugin-node-externals';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { getBabelInputPlugin, getBabelOutputPlugin } from '@rollup/plugin-babel';
import { getBabelInputConfig, getBabelOutputConfig } from './babel';
import { FeatureFlags, Format, BuildUnit } from '../types';
import { EXTENSIONS, EXCLUDE } from '../constants';
import BundleArtifact from '../BundleArtifact';

const sharedPlugins = [resolve({ extensions: EXTENSIONS, preferBuiltins: true }), commonjs()];

function getRollupModuleFormat(format: Format): ModuleFormat {
  if (format === 'umd') {
    return 'umd';
  }

  if (format === 'esm' || format === 'mjs') {
    return 'esm';
  }

  return 'cjs';
}

export function getRollupConfig(
  artifact: BundleArtifact,
  features: FeatureFlags,
): RollupOptions | null {
  const inputPath = artifact.getInputPath();

  if (!inputPath) {
    return null;
  }

  const packagePath = path.resolve(artifact.package.getJsonPath().path());
  const external = [packagePath];

  // Allow other artifacts to reference the primary index
  if (artifact.outputName !== 'index') {
    external.push('./index');
  }

  const config: RollupOptions = {
    cache: artifact.cache,
    external,
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
        exclude: EXCLUDE,
        extensions: EXTENSIONS,
        filename: artifact.package.path.path(),
      }),
    ],
    // Always treeshake for smaller builds
    treeshake: true,
  };

  // Add an output for each format
  config.output = artifact.formats.map((format) => {
    const buildUnit: BuildUnit = {
      format,
      platform: artifact.getPlatform(format),
      target: artifact.package.target,
    };

    const output: OutputOptions = {
      file: artifact.getOutputPath(format).path(),
      format: getRollupModuleFormat(format),
      originalFormat: format,
      // Use const when not supporting old targets
      preferConst: artifact.package.target !== 'legacy',
      // Output specific plugins
      plugins: [
        getBabelOutputPlugin({
          ...getBabelOutputConfig(buildUnit, features),
          filename: artifact.package.path.path(),
        }),
      ],
      // Disable source maps
      sourcemap: false,
    };

    if (format === 'umd') {
      output.extend = true;
      output.name = artifact.namespace;
      output.noConflict = true;
    }

    return output;
  });

  return config;
}
