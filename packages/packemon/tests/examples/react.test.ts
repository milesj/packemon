import { testExampleOutput } from '../helpers';

// This is skipped since Rollup seems to crash with a syntax error,
// and I've been unable to figure out why...
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('React/JSX', () => {
	const oldEnv = process.env.NODE_ENV;

	beforeEach(() => {
		// Development includes host machine file paths
		process.env.NODE_ENV = 'production';
	});

	afterEach(() => {
		process.env.NODE_ENV = oldEnv;
	});

	// Automatic only
	testExampleOutput('react.tsx', 'babel');
});
