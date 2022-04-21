import { testExampleOutput } from '../helpers';

describe('CJS -> MJS wrapper', () => {
	testExampleOutput('cjs-mjs-wrapper.ts', 'babel');
	testExampleOutput('cjs-mjs-wrapper.ts', 'swc');
});
