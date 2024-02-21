import { describe } from 'vitest';
import { testExampleOutput } from '../helpers';

describe('JSON imports', () => {
	testExampleOutput('json-imports.ts', 'babel');
	testExampleOutput('json-imports.ts', 'swc');
});
