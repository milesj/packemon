import { describe } from 'vitest';
import { testExampleOutput } from '../helpers';

describe('Node polyfills', () => {
	testExampleOutput('node-polyfills.ts', 'babel');
	testExampleOutput('node-polyfills.ts', 'swc');
});
