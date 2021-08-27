import { transformAsync, TransformOptions } from '@babel/core';
import cjsEsmBridge from '../src';

async function transform(code: string, options?: TransformOptions): Promise<string> {
	const result = await transformAsync(code, {
		babelrc: false,
		comments: false,
		configFile: false,
		filename: 'file.js',
		plugins: [cjsEsmBridge()],
		presets: ['@babel/preset-react'],
		generatorOpts: {
			jsescOption: { quotes: 'single' },
		},
		...options,
	});

	return result?.code ?? '';
}

describe('cjsEsmBridge()', () => {
	describe('require()', () => {
		it('errors if in a .ts file', async () => {
			await expect(transform("require('foo');", { filename: 'file.ts' })).rejects.toThrow(
				'Found a `require()` call in "file.ts", this is not allowed in ".mjs" files. Use dynamic `import()` instead.',
			);
		});

		it('errors if in a .tsx file', async () => {
			await expect(transform("require('foo');", { filename: 'file.tsx' })).rejects.toThrow(
				'Found a `require()` call in "file.tsx", this is not allowed in ".mjs" files. Use dynamic `import()` instead.',
			);
		});

		it('errors if in a .mjs file', async () => {
			await expect(transform("require('foo');", { filename: 'file.mjs' })).rejects.toThrow(
				'Found a `require()` call in "file.mjs", this is not allowed in ".mjs" files. Use dynamic `import()` instead.',
			);
		});

		it('doesnt error if in a .js file', async () => {
			await expect(transform("require('foo');", { filename: 'file.js' })).resolves.toBeDefined();
		});

		it('doesnt error if in a .cjs file', async () => {
			await expect(transform("require('foo');", { filename: 'file.cjs' })).resolves.toBeDefined();
		});
	});
});
