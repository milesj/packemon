import { Blueprint, toArray } from '@boost/common';
import { schemas } from '@boost/common/optimal';
import {
	DEFAULT_INPUT,
	DEFAULT_PLATFORM,
	DEFAULT_SUPPORT,
	FORMATS_BROWSER,
	FORMATS_ELECTRON,
	FORMATS_NATIVE,
	FORMATS_NODE,
	PLATFORMS,
	SUPPORTS,
} from './constants';
import {
	ApiType,
	BrowserFormat,
	BuildOptions,
	ElectronFormat,
	Format,
	NativeFormat,
	NodeFormat,
	PackemonPackageConfig,
	PackemonPackageFeatures,
	Platform,
	Support,
	ValidateOptions,
} from './types';

const { array, bool, number, object, shape, string, union } = schemas;

// PLATFORMS

const platform = string<Platform>(DEFAULT_PLATFORM).oneOf(PLATFORMS);

// FORMATS

const nativeFormat = string<NativeFormat>('lib').oneOf(FORMATS_NATIVE);
const nodeFormat = string<NodeFormat>('mjs').oneOf(FORMATS_NODE);
const browserFormat = string<BrowserFormat>('esm').oneOf(FORMATS_BROWSER);
const electronFormat = string<ElectronFormat>('esm').oneOf(FORMATS_ELECTRON);

const format = string<Format>().custom((value, path, options) => {
	if (!value) {
		// Fallback to defaults
		return;
	}

	const config = options.rootObject as PackemonPackageConfig;
	const platforms = new Set(toArray(config.platform));

	if (platforms.has('browser') && platforms.size === 1) {
		browserFormat.validate(value as BrowserFormat, path, options);
	} else if (platforms.has('native') && platforms.size === 1) {
		nativeFormat.validate(value as NativeFormat, path, options);
	} else if (platforms.has('node') && platforms.size === 1) {
		nodeFormat.validate(value as NodeFormat, path, options);
	} else if (platforms.has('electron') && platforms.size === 1) {
		electronFormat.validate(value as ElectronFormat, path, options);
	}
});

// SUPPORT

const support = string<Support>(DEFAULT_SUPPORT).oneOf(SUPPORTS);

// BLUEPRINTS

export const packemonFeaturesBlueprint: Blueprint<PackemonPackageFeatures> = {
	cjsTypesCompat: bool(),
	helpers: string('bundled').oneOf<NonNullable<PackemonPackageFeatures['helpers']>>([
		'bundled',
		'external',
		'inline',
		'runtime',
	]),
	swc: bool(),
};

export const packemonBlueprint: Blueprint<PackemonPackageConfig> = {
	api: string('private').oneOf<ApiType>(['public', 'private']),
	bundle: bool(true),
	externals: union([]).of([string(), array().of(string())]),
	features: shape(packemonFeaturesBlueprint),
	format: union(undefined)
		.of([format, array().of(format)])
		.undefinable(),
	inputs: object({ index: DEFAULT_INPUT })
		.of(string())
		.keysOf(string().match(/^[a-zA-Z0-9-_]+$/u)),
	namespace: string(),
	platform: union(DEFAULT_PLATFORM).of([array().of(platform), platform]),
	support,
};

export const buildBlueprint: Blueprint<BuildOptions> = {
	addEngines: bool(),
	addExports: bool(),
	addFiles: bool(),
	concurrency: number(1).gte(1),
	declaration: bool(),
	filter: string(),
	filterFormats: string(),
	filterPlatforms: string(),
	loadConfigs: bool(),
	quiet: bool(),
	skipPrivate: bool(),
	stamp: bool(),
	timeout: number().gte(0),
};

export const validateBlueprint: Blueprint<ValidateOptions> = {
	deps: bool(true),
	engines: bool(true),
	entries: bool(true),
	license: bool(true),
	links: bool(true),
	meta: bool(true),
	people: bool(true),
	quiet: bool(false),
	skipPrivate: bool(false),
	repo: bool(true),
};
