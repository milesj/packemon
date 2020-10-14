import { StyleType } from '@boost/cli';
import { ArtifactState, Target } from './types';

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
export const NODE_TARGETS: { [K in Target]: string } = {
  legacy: '10.3.0', // Requires NPM v6
  modern: '12.0.0',
  future: '14.13.0',
};

export const NPM_TARGETS: { [K in Target]: string } = {
  legacy: '6.1.0',
  modern: '6.9.0',
  future: '6.14.0',
};

// Based on browserslist: https://github.com/browserslist/browserslist
export const BROWSER_TARGETS: { [K in Target]: string | string[] } = {
  legacy: 'IE 11',
  modern: 'defaults',
  future: ['last 2 chrome versions', 'last 2 firefox versions'],
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
