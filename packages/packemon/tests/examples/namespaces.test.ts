import { testExampleOutput } from '../helpers';

describe('Namespaces', () => {
	testExampleOutput('namespaces.ts', 'babel');
	testExampleOutput('namespaces.ts', 'swc');
});
