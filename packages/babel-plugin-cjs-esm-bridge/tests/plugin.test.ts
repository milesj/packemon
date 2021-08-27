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
				'Found a `require()` call in non-module file "file.ts". Use dynamic `import()` instead.',
			);
		});

		it('errors if in a .tsx file', async () => {
			await expect(transform("require('foo');", { filename: 'file.tsx' })).rejects.toThrow(
				'Found a `require()` call in non-module file "file.tsx". Use dynamic `import()` instead.',
			);
		});

		it('errors if in a .mjs file', async () => {
			await expect(transform("require('foo');", { filename: 'file.mjs' })).rejects.toThrow(
				'Found a `require()` call in non-module file "file.mjs". Use dynamic `import()` instead.',
			);
		});

		it('doesnt error if in a .js file', async () => {
			await expect(transform("require('foo');", { filename: 'file.js' })).resolves.not.toThrow();
		});

		it('doesnt error if in a .cjs file', async () => {
			await expect(transform("require('foo');", { filename: 'file.cjs' })).resolves.not.toThrow();
		});
	});

	describe('exports.<name>', () => {
		it('errors if in a .ts file', async () => {
			await expect(transform('exports.foo = 123;', { filename: 'file.ts' })).rejects.toThrow(
				'Found an `exports.foo =` expression in non-module file "file.ts". Use `export const foo =` instead.',
			);
		});

		it('errors if in a .tsx file', async () => {
			await expect(transform("exports.bar = 'abc';", { filename: 'file.tsx' })).rejects.toThrow(
				'Found an `exports.bar =` expression in non-module file "file.tsx". Use `export const bar =` instead.',
			);
		});

		it('errors if in a .mjs file', async () => {
			await expect(transform('exports.baz = true', { filename: 'file.mjs' })).rejects.toThrow(
				'Found an `exports.baz =` expression in non-module file "file.mjs". Use `export const baz =` instead.',
			);
		});

		it('doesnt error if in a .js file', async () => {
			await expect(transform('exports.foo = 123;', { filename: 'file.js' })).resolves.not.toThrow();
		});

		it('doesnt error if in a .cjs file', async () => {
			await expect(
				transform('exports.baz = true', { filename: 'file.cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error for other member expressions', async () => {
			await expect(transform('obj.prop = 123', { filename: 'file.mjs' })).resolves.not.toThrow();
		});
	});

	describe('module.exports', () => {
		it('errors if in a .ts file', async () => {
			await expect(transform('module.exports = 123;', { filename: 'file.ts' })).rejects.toThrow(
				'Found a `module.exports =` expression in non-module file "file.ts". Use `export default` instead.',
			);
		});

		it('errors if in a .tsx file', async () => {
			await expect(transform("module.exports = 'abc';", { filename: 'file.tsx' })).rejects.toThrow(
				'Found a `module.exports =` expression in non-module file "file.tsx". Use `export default` instead.',
			);
		});

		it('errors if in a .mjs file', async () => {
			await expect(transform('module.exports = true', { filename: 'file.mjs' })).rejects.toThrow(
				'Found a `module.exports =` expression in non-module file "file.mjs". Use `export default` instead.',
			);
		});

		it('doesnt error if in a .js file', async () => {
			await expect(
				transform('module.exports = 123;', { filename: 'file.js' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if in a .cjs file', async () => {
			await expect(
				transform('module.exports = true', { filename: 'file.cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error for other member expressions', async () => {
			await expect(transform('obj.prop = 123', { filename: 'file.mjs' })).resolves.not.toThrow();
		});
	});
});
