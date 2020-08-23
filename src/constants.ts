import { Target } from './types';

export const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs'];

export const EXCLUDE = [
  'node_modules/**',
  '__fixtures__/**',
  '__mocks__/**',
  '__tests__/**',
  '*.config.(c|m)?js',
  '*.(test|spec).(js|ts)x?',
];

// Based on LTS schedule: https://nodejs.org/en/about/releases/
export const NODE_TARGETS: { [K in Target]: string } = {
  legacy: '10.0.0',
  modern: '12.0.0',
  future: '14.8.0',
};

// Based on browserslist: https://github.com/browserslist/browserslist
export const BROWSER_TARGETS: { [K in Target]: string | string[] } = {
  legacy: 'IE 11',
  modern: 'defaults',
  future: ['last 2 chrome versions', 'last 2 firefox versions', 'last 2 safari versions'],
};
