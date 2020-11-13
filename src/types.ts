import ts from 'typescript';
import { PackageStructure } from '@boost/common';

export type Platform = 'node' | 'browser'; // electron

export type Support =
  // Unsupported version
  | 'legacy'
  // Oldest version still supported
  | 'stable'
  // Latest version
  | 'current'
  // Next/future version
  | 'experimental';

export type CommonFormat =
  // CommonJS modules with ".js" file extension
  'lib';

export type BrowserFormat =
  | CommonFormat
  // ECMAScript modules with ".js" file extension
  | 'esm'
  // Universal Module Definition with ".js" file extension
  | 'umd';

export type NodeFormat =
  | CommonFormat
  // CommonJS modules with ".cjs" file extension
  | 'cjs'
  // ECMAScript modules with ".mjs" file extension
  | 'mjs';

export type Format = NodeFormat | BrowserFormat;

export type AnalyzeType = 'none' | 'sunburst' | 'treemap' | 'network';

export type DeclarationType = 'none' | 'standard' | 'api';

// PACKAGES

export interface PackemonPackageConfig {
  format?: Format | Format[];
  inputs?: Record<string, string>;
  namespace?: string;
  platform?: Platform | Platform[];
  support?: Support;
}

export interface PackemonPackage extends PackageStructure {
  packemon: PackemonPackageConfig | PackemonPackageConfig[];
}

export interface PackageConfig {
  formats: Format[];
  inputs: Record<string, string>;
  namespace: string;
  platforms: Platform[];
  support: Support;
}

// BUILD

export type ArtifactState = 'pending' | 'building' | 'passed' | 'failed';

export interface BuildOptions {
  addEngines: boolean;
  addExports: boolean;
  analyzeBundle: AnalyzeType;
  concurrency: number;
  generateDeclaration: DeclarationType;
  skipPrivate: boolean;
  timeout: number;
}

export interface BuildResult {
  [key: string]: unknown;
  time: number;
}

export interface BundleBuild {
  format: Format;
  platform: Platform;
  support: Support;
  stats?: { size: number };
}

export interface TypesBuild {
  inputPath: string;
  outputName: string;
}

// VALIDATE

export interface ValidateOptions {
  deps: boolean;
  engines: boolean;
  entries: boolean;
  license: boolean;
  links: boolean;
  people: boolean;
  repo: boolean;
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

// OTHER

export type Awaitable = void | Promise<void>;

export type TSConfigStructure = ts.ParsedCommandLine;

export interface APIExtractorStructure {
  projectFolder: string;
  mainEntryPointFilePath: string;
  dtsRollup: {
    untrimmedFilePath: string;
  };
}
