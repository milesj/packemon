import { Blueprint, toArray } from '@boost/common';
import { schemas } from '@boost/common/optimal';
import {
	DEFAULT_INPUT,
	DEFAULT_PLATFORM,
	DEFAULT_SUPPORT,
	FORMATS,
	FORMATS_BROWSER,
	FORMATS_NATIVE,
	FORMATS_NODE,
	PLATFORMS,
	SUPPORTS,
} from './constants';
import {
	AnalyzeType,
	ApiType,
	BrowserFormat,
	BuildOptions,
	DeclarationType,
	Format,
	NativeFormat,
	NodeFormat,
	PackemonPackageConfig,
	Platform,
	Support,
	ValidateOptions,
} from './types';

const { array, bool, number, object, string, union } = schemas;

// PLATFORMS

const platform = string<Platform>(DEFAULT_PLATFORM).oneOf(PLATFORMS);

// FORMATS

const nativeFormat = string<NativeFormat>('lib').oneOf(FORMATS_NATIVE);
const nodeFormat = string<NodeFormat>('mjs').oneOf(FORMATS_NODE);
const browserFormat = string<BrowserFormat>('esm').oneOf(FORMATS_BROWSER);

const format = string<Format>('lib')
	.oneOf(FORMATS)
	.custom((value, path, options) => {
		const config = options.rootObject as PackemonPackageConfig;
		const platforms = new Set(toArray(config.platform));

		if (platforms.has('browser') && platforms.size === 1) {
			browserFormat.validate(value as BrowserFormat, path, options);
		} else if (platforms.has('native') && platforms.size === 1) {
			nativeFormat.validate(value as NativeFormat, path, options);
		} else if (platforms.has('node') && platforms.size === 1) {
			nodeFormat.validate(value as NodeFormat, path, options);
		}
	});

// SUPPORT

const support = string<Support>(DEFAULT_SUPPORT).oneOf(SUPPORTS);

// BLUEPRINTS

export const packemonBlueprint: Blueprint<PackemonPackageConfig> = {
	api: string('private').oneOf<ApiType>(['public', 'private']),
	bundle: bool(true),
	externals: union([]).of([string(), array().of(string())]),
	format: union([]).of([array().of(format), format]),
	inputs: object({ index: DEFAULT_INPUT }).of(string()).keysOf(string().match(/^\w+$/u)),
	namespace: string(),
	platform: union(DEFAULT_PLATFORM).of([array().of(platform), platform]),
	support,
};

export const buildBlueprint: Blueprint<BuildOptions> = {
	addEngines: bool(),
	addExports: bool(),
	addFiles: bool(),
	analyze: string('none').oneOf<AnalyzeType>(['none', 'sunburst', 'treemap', 'network']),
	concurrency: number(1).gte(1),
	declaration: string('none').oneOf<DeclarationType>(['none', 'standard', 'api']),
	declarationConfig: string(),
	filter: string(),
	filterFormats: string(),
	filterPlatforms: string(),
	quiet: bool(false),
	skipPrivate: bool(),
	timeout: number().gte(0),
};

export const validateBlueprint: Blueprint<ValidateOptions> = {
	deps: bool(true),
	engines: bool(true),
	entries: bool(true),
	files: bool(true),
	license: bool(true),
	links: bool(true),
	meta: bool(true),
	people: bool(true),
	quiet: bool(false),
	skipPrivate: bool(false),
	repo: bool(true),
};
