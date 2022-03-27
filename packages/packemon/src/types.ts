import { OutputOptions as RollupOutputOptions, RollupOptions } from 'rollup';
import { TransformOptions } from '@babel/core';
import { PackageStructure } from '@boost/common';
import { Config } from '@swc/core';

// Platform = The runtime or operating system the code will run in.
// Support = The supported version of the platform.
// Format = Different outputs for compiled code.
// Environment = Combination of platform + support.
// Build = Combination of platform + support + format.
// Build target = Individual units of a build (typically the format).

declare global {
	// eslint-disable-next-line no-underscore-dangle
	const __DEV__: boolean;
}

export type Platform = 'browser' | 'native' | 'node'; // electron

export type Support =
	// Latest version
	| 'current'
	// Next/future version
	| 'experimental'
	// Unsupported version
	| 'legacy'
	// Oldest version still supported
	| 'stable';

export type Environment = `${Platform}:${Support}`;

export type CommonFormat =
	// CommonJS modules with ".js" file extension
	'lib';

export type BrowserFormat =
	| CommonFormat
	// ECMAScript modules with ".js" file extension
	| 'esm'
	// Universal Module Definition with ".js" file extension
	| 'umd';

export type NativeFormat = CommonFormat;

export type NodeFormat =
	| CommonFormat
	// CommonJS modules with ".cjs" file extension
	| 'cjs'
	// ECMAScript modules with ".mjs" file extension
	| 'mjs';

export type Format = BrowserFormat | NodeFormat;

export type ApiType = 'private' | 'public';

// PACKAGES

export type InputMap = Record<string, string>;

export interface PackemonPackageConfig {
	api?: ApiType;
	bundle?: boolean;
	externals?: string[] | string;
	format?: Format | Format[];
	inputs?: InputMap;
	namespace?: string;
	platform?: Platform | Platform[];
	support?: Support;
}

export interface PackemonPackage extends PackageStructure {
	packemon: PackemonPackageConfig | PackemonPackageConfig[];
	release?: string;
}

export interface PackageConfig {
	api: ApiType;
	bundle: boolean;
	externals: string[];
	formats: Format[];
	inputs: InputMap;
	namespace: string;
	platform: Platform;
	support: Support;
}

// PACKAGE EXPORTS
// https://webpack.js.org/guides/package-exports

export type PackageExportConditions =
	| 'browser'
	| 'default'
	| 'import'
	| 'module'
	| 'node'
	| 'react-native'
	| 'require'
	| 'types';

export type PackageExportPaths = {
	[K in PackageExportConditions]?: PackageExportPaths | string;
};

export type PackageExports = Record<string, PackageExportPaths | string>;

// BUILD

export type ArtifactState = 'building' | 'failed' | 'passed' | 'pending';

export interface FilterOptions {
	filter?: string;
	filterFormats?: string;
	filterPlatforms?: string;
	skipPrivate?: boolean;
}

export interface BuildOptions extends FilterOptions {
	addEngines?: boolean;
	addExports?: boolean;
	addFiles?: boolean;
	concurrency?: number;
	declaration?: boolean;
	declarationConfig?: string;
	loadConfigs?: boolean;
	stamp?: boolean;
	timeout?: number;
	quiet?: boolean;
}

export interface BuildParams {
	features: FeatureFlags;
	format: Format;
	platform: Platform;
	support: Support;
}

export interface BuildResultFiles {
	code: string;
	file: string;
}

export interface BuildResult {
	files: BuildResultFiles[];
	time: number;
}

export interface CodeBuild {
	format: Format;
	stats?: { size: number };
}

export interface TypesBuild {
	inputFile: string;
	outputName: string;
}

// VALIDATE

export interface ValidateOptions {
	deps?: boolean;
	engines?: boolean;
	entries?: boolean;
	files?: boolean;
	license?: boolean;
	links?: boolean;
	meta?: boolean;
	people?: boolean;
	quiet?: boolean;
	skipPrivate?: boolean;
	repo?: boolean;
}

// CONFIG

export interface FeatureFlags {
	decorators?: boolean;
	flow?: boolean;
	react?: boolean;
	strict?: boolean;
	typescript?: boolean;
	workspaces?: string[];
}

declare module 'rollup' {
	interface OutputOptions {
		originalFormat?: Format;
	}
}

// SCAFFOLD

export type InfraType = 'monorepo' | 'polyrepo';

export type TemplateType = 'monorepo-package' | 'monorepo' | 'polyrepo-package' | 'polyrepo';

export interface ScaffoldParams {
	author: string;
	template: TemplateType;
	projectName: string;
	packageName: string;
	packagePath?: string;
	repoUrl: string;
	year: number;
}

// CONFIGS

export type ConfigMutator<T> = (config: T) => void;

export type ConfigMutatorWithBuild<T> = (config: T, build: BuildParams) => void;

export interface ConfigFile {
	babelInput?: ConfigMutator<TransformOptions>;
	babelOutput?: ConfigMutatorWithBuild<TransformOptions>;
	rollupInput?: ConfigMutator<RollupOptions>;
	rollupOutput?: ConfigMutatorWithBuild<RollupOutputOptions>;
	swcInput?: ConfigMutator<Config>;
	swcOutput?: ConfigMutatorWithBuild<Config>;
}

// OTHER

export type Awaitable = Promise<void> | void;

export interface TSConfigStructure {
	options: {
		declarationDir?: string;
		experimentalDecorators?: boolean;
		outDir?: string;
		strict?: boolean;
	};
}
