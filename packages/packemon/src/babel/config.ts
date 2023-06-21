import { PluginItem, TransformOptions as ConfigStructure } from '@babel/core';
import { Artifact } from '../Artifact';
import {
	BROWSER_TARGETS,
	ELECTRON_TARGETS,
	NATIVE_TARGETS,
	NODE_SUPPORTED_VERSIONS,
} from '../constants';
import { shouldKeepDynamicImport } from '../helpers/shouldKeepDynamicImport';
import { ConfigFile, FeatureFlags, Format, Platform, Support } from '../types';
import { resolve, resolveFromBabel } from './resolve';

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

	const exclude = [
		// https://caniuse.com/async-functions
		'@babel/plugin-transform-regenerator',
		'@babel/plugin-transform-async-to-generator',
	];

	// https://caniuse.com/es6-module-dynamic-import
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

		case 'electron':
			return {
				exclude,
				modules,
				targets: { electron: ELECTRON_TARGETS[support] },
			};

		case 'native':
			return {
				exclude,
				modules,
				targets: { browsers: NATIVE_TARGETS[support] },
			};

		case 'node':
			return {
				exclude,
				modules,
				targets: { node: NODE_SUPPORTED_VERSIONS[support] },
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
	};
}

// The input config should only parse special syntax, not transform and downlevel.
// This applies to all formats within a build target.
export function getBabelInputConfig(
	artifact: Artifact,
	features: FeatureFlags,
	packemonConfig: ConfigFile = {},
): Omit<ConfigStructure, 'exclude' | 'include'> {
	const plugins: PluginItem[] = [];
	const presets: PluginItem[] = [];
	const tsOptions = {
		allowDeclareFields: true,
		onlyRemoveTypeImports: false,
		optimizeConstEnums: true,
	};

	if (features.flow) {
		presets.push([resolve('@babel/preset-flow'), { allowDeclareFields: true }]);
	}

	if (features.typescript) {
		presets.push([resolve('@babel/preset-typescript'), tsOptions]);

		// When decorators are used, class properties must be loose
		if (features.decorators) {
			plugins.push(
				[resolve('@babel/plugin-transform-typescript'), tsOptions],
				[resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
				[resolveFromBabel('@babel/plugin-transform-class-properties'), { loose: true }],
				[resolveFromBabel('@babel/plugin-transform-private-methods'), { loose: true }],
				[resolveFromBabel('@babel/plugin-transform-private-property-in-object'), { loose: true }],
			);
		}
	}

	if (features.react) {
		presets.push([
			resolve('@babel/preset-react'),
			{
				// development: __DEV__,
				runtime: features.react,
				throwIfNamespace: true,
				useBuiltIns: true,
			},
		]);
	}

	if (features.solid) {
		presets.push(resolve('babel-preset-solid'));
	}

	const config = getSharedConfig(plugins, presets, features);

	if (artifact.features.helpers === 'runtime') {
		plugins.push([
			resolve('@babel/plugin-transform-runtime'),
			{ corejs: false, helpers: true, regenerator: false },
		]);
	} else if (artifact.features.helpers === 'external') {
		plugins.push(resolve('@babel/plugin-external-helpers'));
	}

	// Allow consumers to mutate
	packemonConfig.babelInput?.(config);

	return config;
}

// The output config does all the transformation and downleveling through the preset-env.
// This is handled per output since we need to configure based on target + format combinations.
export function getBabelOutputConfig(
	artifact: Artifact,
	format: Format,
	features: FeatureFlags,
	packemonConfig: ConfigFile = {},
): ConfigStructure {
	const plugins: PluginItem[] = [];
	const presets: PluginItem[] = [];
	const isESM = format === 'esm' || format === 'mjs';

	// PRESETS

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
		...getPlatformEnvOptions(artifact.platform, artifact.support, format),
	};

	presets.push([resolve('@babel/preset-env'), envOptions]);

	// PLUGINS

	plugins.push(
		// Use `Object.assign` when available
		[resolveFromBabel('@babel/plugin-transform-destructuring'), { useBuiltIns: true }],
		[resolveFromBabel('@babel/plugin-transform-object-rest-spread'), { useBuiltIns: true }],
	);

	if (artifact.platform === 'node') {
		plugins.push([resolve('babel-plugin-cjs-esm-interop'), { format: isESM ? 'mjs' : 'cjs' }]);

		// Node 14 does not support ??=, etc
		if (artifact.support === 'legacy') {
			plugins.push(
				resolveFromBabel('@babel/plugin-transform-logical-assignment-operators'),
				resolveFromBabel('@babel/plugin-transform-nullish-coalescing-operator'),
			);
		}
	}

	plugins.push(
		resolve('babel-plugin-conditional-invariant'),
		resolve('babel-plugin-env-constants'),
	);

	const config = getSharedConfig(plugins, presets, features);

	// Allow consumers to mutate
	packemonConfig.babelOutput?.(config, {
		features,
		format,
		platform: artifact.platform,
		support: artifact.support,
	});

	return config;
}
