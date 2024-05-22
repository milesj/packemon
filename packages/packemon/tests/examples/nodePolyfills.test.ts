import { describe } from 'vitest';
import { testExampleOutput } from '../helpers';

// This is currently buggy!
describe.skip('Node polyfills', () => {
	testExampleOutput('node-polyfills.ts', 'babel');
	testExampleOutput('node-polyfills.ts', 'swc');
});
