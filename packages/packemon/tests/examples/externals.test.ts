import { testExampleOutput } from '../helpers';

describe('Rollup externals', () => {
	testExampleOutput('externals.ts', { externals: ['@packemon/foo', '@packemon/bar'] });
});

describe('Rollup externals (regex)', () => {
	testExampleOutput('externals.ts', { externals: ['@packemon/\\*'] });
});
