import { describe } from 'vitest';
import { testExampleOutput } from '../helpers';

describe('Async/await', () => {
	testExampleOutput('async-await.ts', 'babel');
	testExampleOutput('async-await.ts', 'swc');
});
