import { testExampleOutput } from '../helpers';

describe('Dynamic imports', () => {
	testExampleOutput('dynamic-imports.ts', 'babel');
	testExampleOutput('dynamic-imports.ts', 'swc');
});
