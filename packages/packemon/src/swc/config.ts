import {
	Config,
	EnvConfig,
	JscTarget,
	ModuleConfig,
	Options,
	TransformConfig,
	TsParserConfig,
} from '@swc/core';
import { CodeArtifact } from '../CodeArtifact';
import { BROWSER_TARGETS, NATIVE_TARGETS, NODE_SUPPORTED_VERSIONS } from '../constants';
import { ConfigFile, FeatureFlags, Format, Platform, Support } from '../types';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#browser_compatibility
function shouldKeepDynamicImport(platform: Platform, support: Support): boolean {
	if (platform === 'node') {
		return support === 'current' || support === 'experimental';
	}

	return support !== 'legacy';
}

function getJscTarget(support: Support): JscTarget {
	switch (support) {
		case 'experimental':
			return 'es2022';
		case 'current':
			return 'es2020';
		case 'stable':
			return 'es2018';
		default:
			return 'es5';
	}
}

function getModuleConfigType(format: Format): ModuleConfig['type'] {
	switch (format) {
		case 'esm':
		case 'mjs':
			return 'es6';
		case 'umd':
			return 'umd';
		default:
			return 'commonjs';
	}
}

function getPlatformEnvOptions(platform: Platform, support: Support, format: Format): EnvConfig {
	switch (platform) {
		case 'browser':
			return {
				targets: Array.isArray(BROWSER_TARGETS[support])
					? (BROWSER_TARGETS[support] as string[]).join(', ')
					: BROWSER_TARGETS[support],
			};

		case 'native':
			return {
				targets: NATIVE_TARGETS[support],
			};

		case 'node':
			return {
				targets: {
					node: NODE_SUPPORTED_VERSIONS[support],
				},
			};

		default:
			throw new Error(`Unknown platform "${platform}".`);
	}
}

function getSharedConfig(config: Config): Options {
	return {
		...config,
		jsc: {
			...config.jsc,
			keepClassNames: true,
			preserveAllComments: true,
		},
		caller: {
			name: 'packemon',
		},
		// Do NOT load `.swcrc` files as we need full control
		configFile: false,
		swcrc: false,
	};
}

// The input config should only parse special syntax, not transform and downlevel.
// This applies to all formats within a build target.
export function getSwcInputConfig(
	artifact: CodeArtifact,
	features: FeatureFlags,
	packemonConfig: ConfigFile = {},
): Omit<Options, 'exclude' | 'test'> {
	const transform: TransformConfig = {
		// Keep the input as similar as possible
		optimizer: undefined,
	};

	const baseConfig: Config = {
		jsc: {
			parser: {
				syntax: 'ecmascript',
				jsx: features.react,
				dynamicImport: true,
			},
			transform,
			// Keep the input as similar as possible
			externalHelpers: false,
			loose: false,
			target: 'es2022',
		},
	};

	if (features.typescript) {
		const parser: TsParserConfig = {
			syntax: 'typescript',
			tsx: features.react,
			dynamicImport: true,
		};

		if (features.decorators) {
			parser.decorators = true;
			transform.legacyDecorator = true;
		}

		baseConfig.jsc!.parser = parser;
	}

	if (features.react) {
		transform.react = {
			development: __DEV__,
			runtime: 'classic',
			throwIfNamespace: true,
		};
	}

	const config = getSharedConfig(baseConfig);

	// Allow consumers to mutate
	packemonConfig.swcInput?.(config);

	return config;
}

// The output config does all the transformation and downleveling through the preset-env.
// This is handled per output since we need to configure based on target + format combinations.
export function getSwcOutputConfig(
	platform: Platform,
	support: Support,
	format: Format,
	features: FeatureFlags,
	packemonConfig: ConfigFile = {},
): Options {
	const env: EnvConfig = {
		// Prefer spec compliance in development
		loose: false,
		// Consumers must polyfill accordingly
		mode: undefined, // useBuiltIns
		// Transform features accordingly
		// @ts-expect-error Not typed
		bugfixes: true,
		shippedProposals: true,
		// Platform specific
		...getPlatformEnvOptions(platform, support, format),
	};

	// While modern browsers support these features, Node.js does not,
	// which results in failing builds trying to parse the syntax.
	// Let's only apply this for the lib format, but allow it for esm.
	// TODO: Drop in Node 12+
	if ((platform === 'browser' || platform === 'native') && format === 'lib') {
		env.include = [
			'proposal-logical-assignment-operators',
			'proposal-nullish-coalescing-operator',
			'proposal-optional-chaining',
		];
	}

	const module: ModuleConfig = {
		type: getModuleConfigType(format),
		// @ts-expect-error Not typed
		ignoreDynamic: shouldKeepDynamicImport(platform, support),
	};

	const baseConfig: Config = {
		env,
		module,
		// Now we can downlevel
		jsc: {
			parser: {
				syntax: 'ecmascript',
			},
			transform: {
				optimizer: {
					globals: {
						vars: {
							__DEV__: "process.env.NODE_ENV !== 'production'",
							__PROD__: "process.env.NODE_ENV === 'production'",
							__TEST__: "process.env.NODE_ENV === 'test'",
						},
					},
				},
			},
			target: getJscTarget(support),
		},
	};

	const config = getSharedConfig(baseConfig);

	// Allow consumers to mutate
	packemonConfig.swcOutput?.(config, { features, format, platform, support });

	return config;
}
