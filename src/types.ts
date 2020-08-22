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

export interface PackemonPackage extends PackageStructure {
  packemon?: {
    namespace?: string;
    platform?: Platform;
    target?: Target;
  };
}

export interface PackemonOptions {
  checkLicenses: boolean;
  skipPrivate: boolean;
  // Node
  addExports: boolean;
}

export interface Build {
  formats: Format[];
  meta: {
    namespace?: string;
    workspaces: string[];
  };
  package: PackemonPackage;
  path: Path;
  platform: Platform;
  target: Target;
}

export interface FeatureFlags {
  decorators?: boolean;
  flow?: boolean;
  react?: boolean;
  typescript?: boolean;
}
