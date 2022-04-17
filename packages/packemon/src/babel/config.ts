import { PluginItem, TransformOptions as ConfigStructure } from '@babel/core';
import { CodeArtifact } from '../CodeArtifact';
import { BROWSER_TARGETS, NATIVE_TARGETS, NODE_SUPPORTED_VERSIONS } from '../constants';
import { ConfigFile, FeatureFlags, Format, Platform, Support } from '../types';
import { resolve, resolveFromBabel } from './resolve';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#browser_compatibility
function shouldKeepDynamicImport(platform: Platform, support: Support): boolean {
	return platform === 'node' ? support !== 'legacy' : true;
}

// https://babeljs.io/docs/en/babel-preset-env
export interface PresetEnvOptions {
	browserslistEnv?: string;
	bugfixes?: boolean;
	corejs?: 2 | 3 | { version: 2 | 3; proposals: boolean };
	debug?: boolean;
	exclude?: string[];
	forceAllTransforms?: boolean;
	ignoreBrowserslistConfig?: boolean;
	include?: string[];
	loose?: boolean;
	modules?: 'amd' | 'auto' | 'cjs' | 'commonjs' | 'systemjs' | 'umd' | false;
	shippedProposals?: boolean;
	spec?: boolean;
	targets?: Record<string, string[] | string> | string[] | string;
	useBuiltIns?: 'entry' | 'usage' | false;
}

function getPlatformEnvOptions(
	platform: Platform,
	support: Support,
	format: Format,
): PresetEnvOptions {
	let modules: PresetEnvOptions['modules'] = false;

	if (format === 'umd') {
		modules = 'umd';
	} else if (format === 'cjs' || format === 'lib') {
		modules = 'cjs'; // Babel CommonJS
	}

	const exclude = [];

	if (shouldKeepDynamicImport(platform, support)) {
		exclude.push('@babel/plugin-proposal-dynamic-import');
	}

	switch (platform) {
		case 'browser':
			return {
				exclude,
				modules,
				targets: { browsers: BROWSER_TARGETS[support] },
			};

		case 'native':
			return {
				exclude,
				modules,
				targets: { browsers: NATIVE_TARGETS[support] },
			};

		case 'node':
			return {
				exclude: [
					...exclude,
					// Async/await has been available since v7
					'@babel/plugin-transform-regenerator',
					'@babel/plugin-transform-async-to-generator',
				],
				modules,
				targets: {
					node: NODE_SUPPORTED_VERSIONS[support],
				},
			};

		default:
			throw new Error(`Unknown platform "${platform}".`);
	}
}

function getSharedConfig(
	plugins: PluginItem[],
	presets: PluginItem[],
	features: FeatureFlags,
): ConfigStructure {
	return {
		caller: {
			name: 'packemon',
		},
		comments: true,
		parserOpts: {
			sourceType: 'unambiguous',
			strictMode: features.strict,
		},
		plugins,
		presets,
		// Do NOT load root `babel.config.js` or `.babelrc` as we need full control
		configFile: false,
		babelrc: false,
		babelrcRoots: features.workspaces,
	};
}

// The input config should only parse special syntax, not transform and downlevel.
// This applies to all formats within a build target.
export function getBabelInputConfig(
	artifact: CodeArtifact,
	features: FeatureFlags,
	packemonConfig: ConfigFile = {},
): Omit<ConfigStructure, 'exclude' | 'include'> {
	const plugins: PluginItem[] = [];
	const presets: PluginItem[] = [];

	if (features.flow) {
		presets.push([resolve('@babel/preset-flow'), { allowDeclareFields: true }]);
	}

	if (features.typescript) {
		presets.push([resolve('@babel/preset-typescript'), { allowDeclareFields: true }]);

		// When decorators are used, class properties must be loose
		if (features.decorators) {
			plugins.push(
				[resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
				[resolveFromBabel('@babel/plugin-proposal-class-properties'), { loose: true }],
				[resolveFromBabel('@babel/plugin-proposal-private-methods'), { loose: true }],
				[resolveFromBabel('@babel/plugin-proposal-private-property-in-object'), { loose: true }],
			);
		}
	}

	if (features.react) {
		presets.push([
			resolve('@babel/preset-react'),
			{
				runtime: features.react,
				throwIfNamespace: true,
			},
		]);
	}

	const config = getSharedConfig(plugins, presets, features);

	// Allow consumers to mutate
	packemonConfig.babelInput?.(config);

	return config;
}

// The output config does all the transformation and downleveling through the preset-env.
// This is handled per output since we need to configure based on target + format combinations.
export function getBabelOutputConfig(
	platform: Platform,
	support: Support,
	format: Format,
	features: FeatureFlags,
	packemonConfig: ConfigFile = {},
): ConfigStructure {
	const plugins: PluginItem[] = [];
	const presets: PluginItem[] = [];
	const isESM = format === 'esm' || format === 'mjs';

	// ENVIRONMENT

	const envOptions: PresetEnvOptions = {
		// Prefer spec compliance in development
		spec: __DEV__,
		loose: false,
		// Consumers must polyfill accordingly
		useBuiltIns: false,
		// Transform features accordingly
		bugfixes: true,
		shippedProposals: true,
		// Platform specific
		...getPlatformEnvOptions(platform, support, format),
	};

	presets.push([resolve('@babel/preset-env'), envOptions]);

	// PLUGINS

	plugins.push(
		// Use `Object.assign` when available
		[resolveFromBabel('@babel/plugin-transform-destructuring'), { useBuiltIns: true }],
		[resolveFromBabel('@babel/plugin-proposal-object-rest-spread'), { useBuiltIns: true }],
	);

	if ((platform === 'browser' || platform === 'native') && support === 'legacy') {
		plugins.push([
			resolve('@babel/plugin-transform-runtime'),
			{ helpers: false, regenerator: true, useESModules: isESM },
		]);
	}

	if (platform === 'node') {
		plugins.push([resolve('babel-plugin-cjs-esm-interop'), { format: isESM ? 'mjs' : 'cjs' }]);
	}

	plugins.push(
		resolve('babel-plugin-conditional-invariant'),
		resolve('babel-plugin-env-constants'),
	);

	const config = getSharedConfig(plugins, presets, features);

	// Allow consumers to mutate
	packemonConfig.babelOutput?.(config, { features, format, platform, support });

	return config;
}
