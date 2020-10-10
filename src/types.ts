import { PackageStructure } from '@boost/common';
import type { CompilerOptions } from 'typescript';

export type Platform = 'node' | 'browser'; // electron

export type Target =
  // Oldest target still supported
  | 'legacy'
  // Latest target
  | 'modern'
  // Experimental future target
  | 'future';

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
  // CommonJS modules with ".cjs" file extension (node)
  | 'cjs'
  // ECMAScript modules with ".mjs" file extension (node)
  | 'mjs';

export type Format = NodeFormat | BrowserFormat;

export type Phase = 'boot' | 'build' | 'pack';

export interface PackemonPackageConfig {
  inputs: Record<string, string>;
  namespace: string;
  platform: Platform | Platform[];
  target: Target;
}

export interface PackemonPackage extends PackageStructure {
  packemon: PackemonPackageConfig;
}

export interface PackemonOptions {
  addExports: boolean;
  checkLicenses: boolean;
  concurrency: number;
  skipPrivate: boolean;
  timeout: number;
}

// ARTIFACTS

export interface ArtifactFlags {
  requiresSharedLib?: boolean;
}

// BUILD PHASE

export type BuildStatus = 'pending' | 'building' | 'passed' | 'failed' | 'skipped';

export interface BuildResultOutput {
  format: Format;
  path: string;
}

export interface BuildResult {
  time: number;
  output: BuildResultOutput[];
}

export interface BuildUnit {
  format: Format;
  platform: Platform;
  target: Target;
}

// CONFIG

export interface FeatureFlags {
  decorators?: boolean;
  flow?: boolean;
  react?: boolean;
  typescript?: boolean;
  workspaces?: string[];
}

export interface TSConfigStructure {
  compilerOptions?: CompilerOptions;
  extends?: string;
}

declare module 'rollup' {
  interface OutputOptions {
    originalFormat?: Format;
  }
}
