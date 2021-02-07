/* eslint-disable no-underscore-dangle */

import ts from 'typescript';
import { PackageStructure } from '@boost/common';

// Platform = The runtime or operating system the code will run in.
// Support = The supported version of the platform.
// Format = Different outputs for compiled code.
// Environment = Combination of platform + support.
// Build = Combination of platform + support + format.
// Build target = Individual units of a build (typically the format).

declare global {
  const __DEV__: boolean;
  const __PROD__: boolean;
  const __TEST__: boolean;
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
  platform: Platform;
  support: Support;
}

// BUILD

export type ArtifactState = 'building' | 'failed' | 'passed' | 'pending';

export interface BuildOptions {
  addEngines?: boolean;
  addExports?: boolean;
  analyze?: AnalyzeType;
  concurrency?: number;
  declaration?: DeclarationType;
  skipPrivate?: boolean;
  timeout?: number;
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
  inputFile: string;
  outputName: string;
}

// VALIDATE

export interface ValidateOptions {
  deps?: boolean;
  engines?: boolean;
  entries?: boolean;
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

// OTHER

export type Awaitable = Promise<void> | void;

export type TSConfigStructure = ts.ParsedCommandLine;

export interface APIExtractorStructure {
  projectFolder: string;
  mainEntryPointFilePath: string;
  dtsRollup: {
    untrimmedFilePath: string;
  };
}
