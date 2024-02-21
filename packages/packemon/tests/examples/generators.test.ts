import { describe } from 'vitest';
import { testExampleOutput } from '../helpers';

describe('Generators', () => {
	testExampleOutput('generators.ts', 'babel');
	testExampleOutput('generators.ts', 'swc');
});
