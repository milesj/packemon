import { describe } from 'vitest';
import { testExampleOutput } from '../helpers';

// Dont need to test swc here

describe('Rollup externals', () => {
	testExampleOutput('externals.ts', 'babel', { externals: ['@packemon/foo', '@packemon/bar'] });
});

describe('Rollup externals (regex)', () => {
	testExampleOutput('externals.ts', 'babel', { externals: ['@packemon/\\*'] });
});
