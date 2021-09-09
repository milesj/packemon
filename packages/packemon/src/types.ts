import { PackageStructure } from '@boost/common';

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

export type AnalyzeType = 'network' | 'none' | 'sunburst' | 'treemap';

export type DeclarationType = 'api' | 'none' | 'standard';

// PACKAGES

export type InputMap = Record<string, string>;

export interface PackemonPackageConfig {
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
}

export interface PackageConfig {
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
	analyze?: AnalyzeType;
	concurrency?: number;
	declaration?: DeclarationType;
	declarationConfig?: string;
	timeout?: number;
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
	skipPrivate?: boolean;
	repo?: boolean;
}

// CONFIG

export interface FeatureFlags {
	analyze?: AnalyzeType;
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

export type Template = 'monorepo-package' | 'monorepo' | 'polyrepo-package' | 'polyrepo';

export interface ScaffoldParams {
	author: string;
	template: Template;
	projectName: string;
	packageName: string;
	repoUrl: string;
	year: number;
}

export interface ScaffoldPreparedParams extends ScaffoldParams {
	org: string;
	repo: string;
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

export interface APIExtractorStructure {
	projectFolder: string;
	mainEntryPointFilePath: string;
	dtsRollup: {
		untrimmedFilePath: string;
	};
}
