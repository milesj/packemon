import { PluginItem, TransformOptions as ConfigStructure } from '@babel/core';
import { CodeArtifact } from '../CodeArtifact';
import { BROWSER_TARGETS, NATIVE_TARGETS, NODE_SUPPORTED_VERSIONS } from '../constants';
import { FeatureFlags, Format, Platform, Support } from '../types';
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
		// Allow dynamic import for code splitting
		'@babel/plugin-syntax-dynamic-import',
	];

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
		// Do NOT load root `babel.config.js` as we need full control
		configFile: false,
		// Do load branch `.babelrc.js` files for granular customization
		babelrc: true,
		babelrcRoots: features.workspaces,
	};
}

// The input config should only parse special syntax, not transform and downlevel.
// This applies to all formats within a build target.
export function getBabelInputConfig(
	artifact: CodeArtifact,
	features: FeatureFlags,
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
				development: __DEV__,
				throwIfNamespace: true,
			},
		]);
	}

	return getSharedConfig(plugins, presets, features);
}

// The output config does all the transformation and downleveling through the preset-env.
// This is handled per output since we need to configure based on target + format combinations.
export function getBabelOutputConfig(
	platform: Platform,
	support: Support,
	format: Format,
	features: FeatureFlags,
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

	if (platform === 'browser' || platform === 'native') {
		// While modern browsers support these features, Node.js does not,
		// which results in failing builds trying to parse the syntax.
		// Let's only apply this for the lib format, but allow it for esm.
		if (format === 'lib') {
			plugins.push(
				resolveFromBabel('@babel/plugin-proposal-logical-assignment-operators'),
				resolveFromBabel('@babel/plugin-proposal-nullish-coalescing-operator'),
				resolveFromBabel('@babel/plugin-proposal-optional-chaining'),
			);
		}

		// Both browsers and Node.js support these features outside of legacy targets
		if (support === 'legacy') {
			plugins.push(
				[
					resolve('babel-plugin-transform-async-to-promises'),
					{ inlineHelpers: true, target: 'es5' },
				],
				[
					resolve('@babel/plugin-transform-runtime'),
					{ helpers: false, regenerator: true, useESModules: isESM },
				],
			);
		}
	} else {
		// Use `Object.assign` when available
		plugins.push(
			[resolveFromBabel('@babel/plugin-transform-destructuring'), { useBuiltIns: true }],
			[resolveFromBabel('@babel/plugin-proposal-object-rest-spread'), { useBuiltIns: true }],
		);
	}

	// Support our custom plugins
	if (platform === 'node') {
		plugins.push([resolve('babel-plugin-cjs-esm-interop'), { format: isESM ? 'mjs' : 'cjs' }]);
	}

	plugins.push(
		resolve('babel-plugin-conditional-invariant'),
		resolve('babel-plugin-env-constants'),
	);

	return getSharedConfig(plugins, presets, features);
}
