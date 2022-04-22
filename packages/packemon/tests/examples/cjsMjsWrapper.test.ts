import { testExampleOutput } from '../helpers';

describe('CJS -> MJS wrapper', () => {
	testExampleOutput('cjs-mjs-wrapper.ts', 'babel');
	testExampleOutput('cjs-mjs-wrapper.ts', 'swc');
});

describe('CJS -> MJS wrapper (externals)', () => {
	testExampleOutput('cjs-mjs-wrapper-externals.ts', 'babel');
	// testExampleOutput('cjs-mjs-wrapper.ts', 'swc');
});
