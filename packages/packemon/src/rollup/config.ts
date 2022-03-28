import { ModuleFormat, OutputOptions, RollupOptions } from 'rollup';
import externals from 'rollup-plugin-node-externals';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { getBabelInputPlugin, getBabelOutputPlugin } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { getBabelInputConfig, getBabelOutputConfig } from '../babel/config';
import type { CodeArtifact } from '../CodeArtifact';
import { EXCLUDE, EXCLUDE_RUST, EXTENSIONS } from '../constants';
import { getSwcInputConfig, getSwcOutputConfig } from '../swc/config';
import { ConfigFile, FeatureFlags, Format } from '../types';
import { addBinShebang } from './plugins/addBinShebang';
import { copyAndRefAssets } from './plugins/copyAndRefAssets';
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

function getCodeArtifacts(artifact: CodeArtifact): CodeArtifact[] {
	// Don't include non-code artifacts. We also can't use `instanceof`
	// because of circular dependencies, boo!
	return artifact.package.artifacts.filter(
		(art) => 'configGroup' in art && (art as CodeArtifact).configGroup !== artifact.configGroup,
	) as CodeArtifact[];
}

function getRollupPaths(artifact: CodeArtifact, ext: string): Record<string, string> {
	const paths: Record<string, string> = {};

	if (artifact.bundle) {
		getCodeArtifacts(artifact).forEach((art) => {
			Object.entries(art.getInputPaths()).forEach(([outputName, inputPath]) => {
				// All output files are in the same directory, so we can hard-code a relative path
				paths[inputPath] = `./${outputName}.${ext}`;
			});
		});
	}

	return paths;
}

export function getRollupExternals(artifact: CodeArtifact) {
	const foreignInputs = new Set<string>();

	if (artifact.bundle) {
		const sameInputPaths = new Set(Object.values(artifact.getInputPaths()));

		getCodeArtifacts(artifact).forEach((art) => {
			Object.values(art.getInputPaths()).forEach((inputPath) => {
				if (!sameInputPaths.has(inputPath)) {
					foreignInputs.add(inputPath);
				}
			});
		});
	}

	return (id: string, parent: string = '<unknown>') => {
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

export function getRollupOutputConfig(
	artifact: CodeArtifact,
	features: FeatureFlags,
	format: Format,
	packemonConfig: ConfigFile = {},
): OutputOptions {
	const { platform, support } = artifact;
	const { ext, folder } = artifact.getBuildOutput(format);
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	const isSwc = packemonConfig.swc || !!process.env.PACKEMON_SWC;

	const output: OutputOptions = {
		dir: artifact.package.path.append(folder).path(),
		format: getRollupModuleFormat(format),
		originalFormat: format,
		interop: 'auto',
		// Map our externals to local paths with trailing extension
		paths: getRollupPaths(artifact, ext),
		// Use our extension for file names
		assetFileNames: 'assets/[name].[ext]',
		chunkFileNames: `${artifact.bundle ? 'bundle' : '[name]'}-[hash].${ext}`,
		entryFileNames: `[name].${ext}`,
		preserveModules: !artifact.bundle,
		// Use ESM features when not supporting old targets
		generatedCode: {
			preset: support === 'legacy' ? 'es5' : 'es2015',
			symbols: false, // Enable for pure ESM later on
		},
		preferConst: support !== 'legacy',
		// Output specific plugins
		plugins: [
			isSwc
				? swcOutput({
						...getSwcOutputConfig(platform, support, format, features, packemonConfig),
						filename: artifact.package.path.path(),
						// Maps were extracted before transformation
						sourceMaps: false,
				  })
				: getBabelOutputPlugin({
						...getBabelOutputConfig(platform, support, format, features, packemonConfig),
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

export function getRollupConfig(
	artifact: CodeArtifact,
	features: FeatureFlags,
	packemonConfig: ConfigFile = {},
): RollupOptions {
	const packagePath = artifact.package.packageJsonPath.path();
	const isNode = artifact.platform === 'node';
	const isTest = process.env.NODE_ENV === 'test';
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	const isSwc = packemonConfig.swc || !!process.env.PACKEMON_SWC;

	const config: RollupOptions = {
		cache: artifact.cache,
		external: getRollupExternals(artifact),
		input: artifact.bundle ? artifact.getInputPaths() : artifact.package.getSourceFiles(),
		output: [],
		// Shared output plugins
		plugins: [
			// Mark all dependencies in `package.json` as external
			externals({
				builtins: isNode,
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
				dir: artifact.package.path.append('assets').path(),
			}),
			// Declare Babel/swc here so we can parse TypeScript/Flow
			isSwc
				? swcInput({
						...getSwcInputConfig(artifact, features, packemonConfig),
						exclude: isTest ? [] : EXCLUDE_RUST,
						filename: artifact.package.path.path(),
						// Extract maps from the original source
						sourceMaps: true,
				  })
				: getBabelInputPlugin({
						...getBabelInputConfig(artifact, features, packemonConfig),
						babelHelpers: 'bundled',
						exclude: isTest ? [] : EXCLUDE,
						extensions: EXTENSIONS,
						filename: artifact.package.path.path(),
						// Extract maps from the original source
						sourceMaps: true,
				  }),
		],
		// Treeshake for smaller builds
		treeshake: artifact.bundle,
	};

	// Polyfill node modules when platform is not node
	if (!isNode) {
		config.plugins!.unshift(nodePolyfills());
	}

	// Add an output for each format
	config.output = artifact.builds.map((build) =>
		getRollupOutputConfig(artifact, features, build.format, packemonConfig),
	);

	// Allow consumers to mutate
	packemonConfig.rollupInput?.(config);

	return config;
}
