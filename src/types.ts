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

export interface PackemonPackageConfig {
  format?: Format | Format[];
  inputs?: Record<string, string>;
  namespace?: string;
  platform?: Platform | Platform[];
  support?: Support;
}

export interface PackemonPackage extends PackageStructure {
  packemon: PackemonPackageConfig;
}

export interface PackemonOptions {
  addEngines: boolean;
  addExports: boolean;
  checkLicenses: boolean;
  concurrency: number;
  generateDeclaration: boolean;
  skipPrivate: boolean;
  timeout: number;
}

export interface PackageConfig {
  formats: Format[];
  inputs: Record<string, string>;
  namespace: string;
  platforms: Platform[];
  support: Support;
}

// ARTIFACTS

export interface ArtifactFlags {
  requiresSharedLib?: boolean;
}

export type ArtifactState = 'pending' | 'building' | 'passed' | 'failed';

export interface BuildResult<T> {
  [key: string]: unknown;
  stats: Record<string, T>;
  time: number;
}

export interface BuildUnit {
  format: Format;
  platform: Platform;
  support: Support;
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
