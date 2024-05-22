import type { TransformOptions as ConfigStructure } from '@babel/core';
import { Path, toArray } from '@boost/common';
import type { FeatureFlags } from './types';
import {
	Artifact,
	DEFAULT_SUPPORT,
	type Format,
	getBabelInputConfig,
	getBabelOutputConfig,
	Package,
	Packemon,
	type PackemonPackage,
	type Platform,
	type Support,
} from '.';

const format = (process.env.PACKEMON_FORMAT ?? 'lib') as Format;
const support = (process.env.PACKEMON_SUPPORT ?? DEFAULT_SUPPORT) as Support;

function getBabelConfig(artifact: Artifact, featureFlags: FeatureFlags): ConfigStructure {
	const inputConfig = getBabelInputConfig(artifact, featureFlags, {});
	const outputConfig = getBabelOutputConfig(
		artifact.platform,
		artifact.support,
		artifact.builds[0].format,
		featureFlags,
		{},
	);

	return {
		// Input must come first
		plugins: [...inputConfig.plugins!, ...outputConfig.plugins!],
		// Env must come first
		presets: [...outputConfig.presets!, ...inputConfig.presets!],
	};
}

export interface ConfigOptions {
	format?: Format;
	platform?: Platform;
	support?: Support;
}

export function createConfig(folder: string, options: ConfigOptions = {}): ConfigStructure {
	const path = new Path(folder);
	const packemon = new Packemon();
	const contents = packemon.fs.readJson<PackemonPackage>(path.append('package.json').path());

	// Create package and configs
	const pkg = new Package(path, contents, packemon.findWorkspaceRoot());

	if (pkg.json.packemon) {
		pkg.setConfigs(toArray(pkg.json.packemon));
	}

	// Determine the lowest platform to support
	const platforms = pkg.configs.map((config) => config.platform);
	let lowestPlatform: Platform = 'node';

	// istanbul ignore next
	if (platforms.includes('browser')) {
		lowestPlatform = 'browser';
	} else if (platforms.includes('electron')) {
		lowestPlatform = 'electron';
	} else if (platforms.includes('native')) {
		lowestPlatform = 'native';
	}

	// Generate artifact and builds
	const artifact = new Artifact(pkg, [{ declaration: false, format: options.format ?? format }]);
	artifact.bundle = false;
	artifact.platform = options.platform ?? lowestPlatform;
	artifact.support = options.support ?? support;

	return getBabelConfig(artifact, pkg.getFeatureFlags());
}

export function createRootConfig(options?: ConfigOptions): ConfigStructure {
	const config = createConfig(process.cwd(), options);

	return {
		...config,
		babelrc: false,
		// Support React Native libraries by default
		overrides: [
			{
				presets: ['@babel/preset-flow'],
				test: /node_modules\/((jest-)?react-native|@react-native(-community)?)/iu,
			},
		],
	};
}
