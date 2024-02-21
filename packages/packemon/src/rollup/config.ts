import { ModuleFormat, OutputOptions, Plugin, RollupOptions } from 'rollup';
import { externals as nodeExternals } from 'rollup-plugin-node-externals';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { getBabelInputPlugin, getBabelOutputPlugin } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import type { Artifact } from '../Artifact';
import { getBabelInputConfig, getBabelOutputConfig } from '../babel/config';
import { EXCLUDE, EXCLUDE_RUST, EXTENSIONS } from '../constants';
import { getSwcInputConfig, getSwcOutputConfig } from '../swc/config';
import { ConfigFile, FeatureFlags, Format } from '../types';
import { addBinShebang } from './plugins/addBinShebang';
import { addMjsWrapperForCjs } from './plugins/addMjsWrapperForCjs';
import { copyAndRefAssets } from './plugins/copyAndRefAssets';
import { preserveDynamicImport } from './plugins/preserveDynamicImport';
import { swcInput, swcOutput } from './plugins/swc';

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

function getSiblingArtifacts(artifact: Artifact): Artifact[] {
	return artifact.package.artifacts.filter((art) => art.configGroup !== artifact.configGroup);
}

function getRollupPaths(artifact: Artifact, ext: string): Record<string, string> {
	const paths: Record<string, string> = {};

	if (artifact.bundle) {
		getSiblingArtifacts(artifact).forEach((art) => {
			Object.entries(art.getInputPaths()).forEach(([outputName, inputPath]) => {
				// All output files are in the same directory, so we can hard-code a relative path
				paths[inputPath] = `./${outputName}.${ext}`;
			});
		});
	}

	return paths;
}

export function getRollupExternals(artifact: Artifact) {
	const foreignInputs = new Set<string>();

	if (artifact.bundle) {
		const sameInputPaths = new Set(Object.values(artifact.getInputPaths()));

		getSiblingArtifacts(artifact).forEach((art) => {
			Object.values(art.getInputPaths()).forEach((inputPath) => {
				if (!sameInputPaths.has(inputPath)) {
					foreignInputs.add(inputPath);
				}
			});
		});
	}

	return (id: string, parent: string = '<unknown>') => {
		if (id.includes('@babel/') || id.includes('@swc/helpers')) {
			return true;
		}

		if (foreignInputs.has(id)) {
			throw new Error(
				`Unexpected foreign input import. May only import sibling files within the same \`inputs\` configuration group. File "${parent}" attempted to import "${id}".`,
			);
		}

		for (const pattern of artifact.externals) {
			if (id.match(pattern)) {
				return true;
			}
		}

		return false;
	};
}

// eslint-disable-next-line complexity
export function getRollupOutputConfig(
	artifact: Artifact,
	features: FeatureFlags,
	format: Format,
	packemonConfig: ConfigFile = {},
): OutputOptions {
	const { platform, support } = artifact;
	const { entryExt, folder } = artifact.getBuildOutput(format, 'index');
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	const isSwc = packemonConfig.swc || artifact.features.swc || !!process.env.PACKEMON_SWC;
	const isEsm = format === 'esm' || format === 'mjs';

	const output: OutputOptions = {
		dir: artifact.package.path.append(folder).path(),
		format: getRollupModuleFormat(format),
		originalFormat: format,
		interop: 'auto',
		exports: 'named',
		// Map our externals to local paths with trailing extension
		paths: getRollupPaths(artifact, entryExt),
		// Use our extension for file names
		assetFileNames: 'assets/[name].[ext]',
		chunkFileNames: `${artifact.bundle ? 'bundle' : '[name]'}-[hash].${entryExt}`,
		entryFileNames: `[name].${entryExt}`,
		preserveModules: !artifact.bundle,
		// Use ESM features when not supporting old targets
		generatedCode: {
			preset: 'es2015',
			arrowFunctions: true,
			constBindings: true,
			objectShorthand: true,
			symbols: isEsm,
		},
		// Output specific plugins
		plugins: [
			preserveDynamicImport(platform, format),
			isSwc
				? swcOutput({
						...getSwcOutputConfig(platform, support, format, features, packemonConfig),
						filename: artifact.package.path.path(),
						// Maps were extracted before transformation
						sourceMaps: false,
					})
				: getBabelOutputPlugin({
						...getBabelOutputConfig(
							platform,
							support,
							format,
							features,
							packemonConfig,
							artifact.features.helpers,
						),
						filename: artifact.package.path.path(),
						// Provide a custom name for the UMD global
						moduleId: format === 'umd' ? artifact.namespace : undefined,
						// Maps were extracted before transformation
						sourceMaps: false,
					}),
			addBinShebang(),
		],
		// Always include source maps
		sourcemap: true,
		sourcemapExcludeSources: true,
	};

	// Disable warnings about default exports
	if (format === 'lib' || format === 'cjs') {
		output.exports = 'auto';
	}

	// Automatically prepend a shebang for binaries
	if (artifact.bundle && !(isSwc && format === 'umd')) {
		output.banner = [
			'// Bundled with Packemon: https://packemon.dev\n',
			`// Platform: ${platform}, Support: ${support}, Format: ${format}\n\n`,
		].join('');
	}

	// Allow consumers to mutate
	packemonConfig.rollupOutput?.(output, { features, format, platform, support });

	return output;
}

export async function getRollupConfig(
	artifact: Artifact,
	features: FeatureFlags,
	packemonConfig: ConfigFile = {},
): Promise<RollupOptions> {
	const packagePath = artifact.package.jsonPath.path();
	const isNode = artifact.platform === 'node';
	const isTest = process.env.NODE_ENV === 'test';
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	const isSwc = packemonConfig.swc || artifact.features.swc || !!process.env.PACKEMON_SWC;

	const config: RollupOptions = {
		external: getRollupExternals(artifact),
		input: artifact.bundle ? artifact.getInputPaths() : await artifact.package.findSourceFiles(),
		output: [],
		// Shared output plugins
		plugins: [
			// Mark all dependencies in `package.json` as external
			nodeExternals({
				builtins: isNode,
				builtinsPrefix: isNode && artifact.support !== 'legacy' ? 'add' : 'strip',
				deps: true,
				devDeps: true,
				optDeps: true,
				packagePath,
				peerDeps: true,
			}),
			// Externals MUST be listed before shared plugins
			resolve({ extensions: EXTENSIONS, preferBuiltins: true }),
			commonjs(),
			json({ compact: true, namedExports: false }),
			// Copy assets and update import references
			copyAndRefAssets({
				fs: artifact.package.fs,
				root: artifact.package.path.path(),
			}),
			// Declare Babel/swc here so we can parse TypeScript/Flow
			isSwc
				? swcInput({
						...getSwcInputConfig(artifact, features, packemonConfig),
						exclude: isTest ? [] : EXCLUDE_RUST,
						filename: artifact.package.path.path(),
						// Extract maps from the original source
						sourceMaps: !isNode,
					})
				: getBabelInputPlugin({
						...getBabelInputConfig(artifact, features, packemonConfig),
						babelHelpers: artifact.features.helpers ?? 'bundled',
						exclude: isTest ? [] : EXCLUDE,
						extensions: EXTENSIONS,
						filename: artifact.package.path.path(),
						skipPreflightCheck: true,
						// Extract maps from the original source
						sourceMaps: !isNode,
					}),
		],
		// Treeshake for smaller builds
		treeshake: artifact.bundle,
	};

	// Polyfill node modules when platform is not node
	if (!isNode) {
		(config.plugins as Plugin[]).unshift(nodePolyfills());
	}

	// Add an output for each format
	config.output = artifact.builds.map((build) => {
		if (build.format === 'cjs') {
			(config.plugins as Plugin[]).push(
				addMjsWrapperForCjs({
					inputs: artifact.inputs,
					packageRoot: artifact.package.path,
				}),
			);
		}

		return getRollupOutputConfig(artifact, features, build.format, packemonConfig);
	});

	// Allow consumers to mutate
	packemonConfig.rollupInput?.(config);

	return config;
}
