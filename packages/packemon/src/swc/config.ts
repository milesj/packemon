import {
	Config,
	EnvConfig,
	ModuleConfig,
	Options,
	TransformConfig,
	TsParserConfig,
} from '@swc/core';
import { CodeArtifact } from '../CodeArtifact';
import {
	BROWSER_TARGETS,
	NATIVE_TARGETS,
	NODE_SUPPORTED_VERSIONS,
	SUPPORT_TO_ESM_SPEC,
} from '../constants';
import { shouldKeepDynamicImport } from '../helpers/shouldKeepDynamicImport';
import { ConfigFile, FeatureFlags, Format, Platform, Support } from '../types';

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
		module: {
			type: 'es6',
			ignoreDynamic: true,
		},
		jsc: {
			parser: {
				syntax: 'ecmascript',
				jsx: !!features.react || features.solid,
				dynamicImport: true,
			},
			transform,
			// Keep the input as similar as possible
			externalHelpers: false,
			loose: false,
			target: SUPPORT_TO_ESM_SPEC.experimental,
		},
	};

	if (features.typescript) {
		const parser: TsParserConfig = {
			syntax: 'typescript',
			tsx: !!features.react || features.solid,
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
			runtime: features.react,
			throwIfNamespace: true,
		};
	}

	if (features.solid) {
		transform.react = {
			runtime: 'automatic',
			importSource: 'solid-js',
			pragma: 'createComponent',
			pragmaFrag: 'Fragment',
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

	const module: ModuleConfig = {
		type: getModuleConfigType(format),
		ignoreDynamic: shouldKeepDynamicImport(platform, support),
	};

	// This is to trick the Babel plugin to not transform the const
	const id = (name: string) => `__${name}__`;

	// Now we can downlevel
	const baseConfig: Config = {
		env,
		module,
		jsc: {
			parser: {
				syntax: 'ecmascript',
			},
			transform: {
				optimizer: {
					globals: {
						vars: {
							[id('DEV')]: "process.env.NODE_ENV !== 'production'",
							[id('PROD')]: "process.env.NODE_ENV === 'production'",
							[id('TEST')]: "process.env.NODE_ENV === 'test'",
						},
					},
				},
			},
			target: SUPPORT_TO_ESM_SPEC[support],
		},
	};

	const config = getSharedConfig(baseConfig);

	// Allow consumers to mutate
	packemonConfig.swcOutput?.(config, { features, format, platform, support });

	return config;
}
