import { describe } from 'vitest';
import { testExampleOutput } from '../helpers';

describe('Import attributes', () => {
	testExampleOutput('import-attributes.ts', 'babel');
	testExampleOutput('import-attributes.ts', 'swc');
});
