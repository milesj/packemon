import { testExampleOutput } from '../helpers';

describe('CJS/ESM interop', () => {
	testExampleOutput('cjs-esm-interop.ts', 'babel');
	// Not supported since swc doesnt have plugins
	// testExampleOutput('cjs-esm-interop.ts', 'swc');
});
