import { describe } from 'vitest';
import { testExampleOutput } from '../helpers';

describe('Assets', () => {
	testExampleOutput('asset-imports.ts', 'babel');
	testExampleOutput('asset-imports.ts', 'swc');
});
