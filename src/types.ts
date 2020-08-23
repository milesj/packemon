import { PackageStructure, Path } from '@boost/common';

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

export interface PackemonPackageConfig {
  namespace: string;
  platform: Platform | Platform[];
  target: Target;
}

export interface PackemonPackage extends PackageStructure {
  packemon: PackemonPackageConfig & {
    path: Path;
  };
}

export interface PackemonOptions {
  addExports: boolean;
  checkLicenses: boolean;
  skipPrivate: boolean;
}

// BUILD PHASE

export interface BuildFlags {
  requiresSharedLib?: boolean;
}

export interface Build {
  flags: BuildFlags;
  formats: Format[];
  meta: {
    namespace: string;
    workspaces: string[];
  };
  package: PackemonPackage;
  platforms: Platform[];
  target: Target;
}

export interface BuildUnit {
  format: Format;
  platform: Platform;
  target: Target;
  workspaces: string[];
}

export interface FeatureFlags {
  decorators?: boolean;
  flow?: boolean;
  react?: boolean;
  typescript?: boolean;
}
