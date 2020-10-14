import { StyleType } from '@boost/cli';
import { ArtifactState, Support } from './types';

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

// Based on LTS schedule: https://nodejs.org/en/about/releases/
export const NODE_SUPPORTED_VERSIONS: { [K in Support]: string } = {
  legacy: '8.10.0',
  stable: '10.3.0', // Requires NPM v6
  current: '12.0.0',
  experimental: '14.13.0',
};

export const NPM_SUPPORTED_VERSIONS: { [K in Support]: string | string[] } = {
  legacy: ['5.6.0', '6.0.0'],
  stable: '6.1.0',
  current: '6.9.0',
  experimental: '6.14.0',
};

// Based on browserslist: https://github.com/browserslist/browserslist
export const BROWSER_TARGETS: { [K in Support]: string | string[] } = {
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
  booting: 'Booting',
  building: 'Building',
  packing: 'Packing',
  passed: 'Passed',
  failed: 'Failed',
};
