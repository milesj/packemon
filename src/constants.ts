import { StyleType } from '@boost/cli';
import {
  ArtifactState,
  BrowserFormat,
  Format,
  NativeFormat,
  NodeFormat,
  Platform,
  Support,
} from './types';

export const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs'];

export const EXCLUDE = [
  'node_modules/**',
  'tests/**',
  '__fixtures__/**',
  '__mocks__/**',
  '__tests__/**',
  '*.config.(c|m)?js',
  '*.(test|spec).(js|ts)x?',
];

// https://reactnative.dev/docs/javascript-environment
// Based on browserslist: https://github.com/browserslist/browserslist
export const NATIVE_TARGETS: { [K in Support]: string } = {
  legacy: 'iOS 8',
  stable: 'iOS 10',
  current: 'iOS 12',
  experimental: 'iOS 14',
};

// Based on LTS schedule: https://nodejs.org/en/about/releases/
export const NODE_SUPPORTED_VERSIONS: { [K in Support]: string } = {
  legacy: '8.10.0',
  stable: '10.3.0', // Requires NPM v6
  current: '12.0.0',
  experimental: '16.0.0',
};

export const NPM_SUPPORTED_VERSIONS: { [K in Support]: string[] | string } = {
  legacy: ['5.6.0', '6.0.0'],
  stable: '6.1.0',
  current: '6.9.0',
  experimental: '7.0.0',
};

// Based on browserslist: https://github.com/browserslist/browserslist
export const BROWSER_TARGETS: { [K in Support]: string[] | string } = {
  legacy: 'IE 10',
  stable: 'IE 11',
  current: 'defaults',
  experimental: ['last 2 chrome versions', 'last 2 firefox versions'],
};

export const STATE_COLORS: { [K in ArtifactState]?: StyleType } = {
  pending: 'muted',
  passed: 'success',
  failed: 'failure',
};

export const STATE_LABELS: { [K in ArtifactState]: string } = {
  pending: '',
  building: 'Building',
  passed: 'Passed',
  failed: 'Failed',
};

export const DEFAULT_FORMAT: Format = 'lib';

export const FORMATS_BROWSER: BrowserFormat[] = ['lib', 'esm', 'umd'];

export const FORMATS_NATIVE: NativeFormat[] = ['lib'];

export const FORMATS_NODE: NodeFormat[] = ['lib', 'mjs', 'cjs'];

export const FORMATS: Format[] = ['lib', 'esm', 'umd', 'mjs', 'cjs'];

export const DEFAULT_INPUT = 'src/index.ts';

export const DEFAULT_PLATFORM: Platform = 'browser';

export const PLATFORMS: Platform[] = ['native', 'node', 'browser'];

export const DEFAULT_SUPPORT: Support = 'stable';

export const SUPPORTS: Support[] = ['legacy', 'stable', 'current', 'experimental'];
