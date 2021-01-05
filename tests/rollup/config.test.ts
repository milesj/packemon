import { getRollupConfig } from '../../src/rollup/config';

jest.mock('rollup-plugin-node-externals', () => () => 'externals()');
jest.mock('rollup-plugin-visualizer', () => () => 'visualizer()');
jest.mock('@rollup/plugin-commonjs', () => () => 'commonjs()');
jest.mock('@rollup/plugin-node-resolve', () => () => 'resolve()');
jest.mock('@rollup/plugin-babel', () => ({
  getBabelInputPlugin: () => 'babelInput()',
  getBabelOutputPlugin: () => 'babelOutput()',
}));

describe('getRollupConfig()', () => {});
