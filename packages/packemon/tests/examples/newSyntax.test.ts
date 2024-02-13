import { describe } from 'vitest';
import { testExampleOutput } from '../helpers';

describe('New syntax', () => {
	testExampleOutput('new-syntax.ts', 'babel');
	testExampleOutput('new-syntax.ts', 'swc');
});
