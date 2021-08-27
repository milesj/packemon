import { transformAsync, TransformOptions } from '@babel/core';
import cjsEsmBridge, { CjsEsmBridgeOptions } from '../src';

async function transform(
	code: string,
	options?: TransformOptions,
	pluginOptions?: CjsEsmBridgeOptions,
): Promise<string> {
	const result = await transformAsync(code, {
		babelrc: false,
		comments: false,
		configFile: false,
		filename: 'file.js',
		plugins: [[cjsEsmBridge, pluginOptions]],
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
		it('errors if .ts -> .mjs', async () => {
			await expect(
				transform("require('foo');", { filename: 'file.ts' }, { format: 'mjs' }),
			).rejects.toThrow(
				'Found a `require()` call in non-module file "file.ts". Use dynamic `import()` instead.',
			);
		});

		it('errors if .tsx -> .mjs', async () => {
			await expect(
				transform("require('foo');", { filename: 'file.tsx' }, { format: 'mjs' }),
			).rejects.toThrow(
				'Found a `require()` call in non-module file "file.tsx". Use dynamic `import()` instead.',
			);
		});

		it('errors if .mjs -> .mjs', async () => {
			await expect(
				transform("require('foo');", { filename: 'file.mjs' }, { format: 'mjs' }),
			).rejects.toThrow(
				'Found a `require()` call in non-module file "file.mjs". Use dynamic `import()` instead.',
			);
		});

		it('errors if .cjs -> .mjs', async () => {
			await expect(
				transform("require('foo');", { filename: 'file.cjs' }, { format: 'mjs' }),
			).rejects.toThrow(
				'Found a `require()` call in non-module file "file.cjs". Use dynamic `import()` instead.',
			);
		});

		it('doesnt error if .ts -> .cjs', async () => {
			await expect(
				transform("require('foo');", { filename: 'file.ts' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .mjs -> .cjs', async () => {
			await expect(
				transform("require('foo');", { filename: 'file.mjs' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .js -> .cjs', async () => {
			await expect(
				transform("require('foo');", { filename: 'file.js' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .cjs -> .cjs', async () => {
			await expect(
				transform("require('foo');", { filename: 'file.cjs' }, { format: 'cjs' }),
			).resolves.not.toThrow();
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

	describe('__filename', () => {
		it('transforms from .ts -> .mjs', async () => {
			expect(
				await transform('const file = __filename;', { filename: 'file.ts' }, { format: 'mjs' }),
			).toMatchInlineSnapshot(`"const file = import.meta.url;"`);
		});

		it('transforms from .mjs -> .mjs', async () => {
			expect(
				await transform('const file = __filename;', { filename: 'file.mjs' }, { format: 'mjs' }),
			).toMatchInlineSnapshot(`"const file = import.meta.url;"`);
		});

		it('transforms from .js -> .mjs', async () => {
			expect(
				await transform('const file = __filename;', { filename: 'file.js' }, { format: 'mjs' }),
			).toMatchInlineSnapshot(`"const file = import.meta.url;"`);
		});

		it('transforms from .cjs -> .mjs', async () => {
			expect(
				await transform('const file = __filename;', { filename: 'file.cjs' }, { format: 'mjs' }),
			).toMatchInlineSnapshot(`"const file = import.meta.url;"`);
		});

		it('doesnt transform from .ts -> .cjs', async () => {
			expect(
				await transform('const file = __filename;', { filename: 'file.ts' }, { format: 'cjs' }),
			).toMatchInlineSnapshot(`"const file = __filename;"`);
		});

		it('doesnt transform from .mjs -> .cjs', async () => {
			expect(
				await transform('const file = __filename;', { filename: 'file.mjs' }, { format: 'cjs' }),
			).toMatchInlineSnapshot(`"const file = __filename;"`);
		});

		it('doesnt transform from .js -> .cjs', async () => {
			expect(
				await transform('const file = __filename;', { filename: 'file.js' }, { format: 'cjs' }),
			).toMatchInlineSnapshot(`"const file = __filename;"`);
		});

		it('doesnt transform from .cjs -> .cjs', async () => {
			expect(
				await transform('const file = __filename;', { filename: 'file.cjs' }, { format: 'cjs' }),
			).toMatchInlineSnapshot(`"const file = __filename;"`);
		});
	});

	describe('__dirname', () => {
		it('transforms from .ts -> .mjs', async () => {
			expect(await transform('const dir = __dirname;', { filename: 'file.ts' }, { format: 'mjs' }))
				.toMatchInlineSnapshot(`
			"import _path from 'path';

			const dir = _path.dirname(import.meta.url);"
		`);
		});

		it('transforms from .mjs -> .mjs', async () => {
			expect(await transform('const dir = __dirname;', { filename: 'file.mjs' }, { format: 'mjs' }))
				.toMatchInlineSnapshot(`
			"import _path from 'path';

			const dir = _path.dirname(import.meta.url);"
		`);
		});

		it('transforms from .js -> .mjs', async () => {
			expect(await transform('const dir = __dirname;', { filename: 'file.js' }, { format: 'mjs' }))
				.toMatchInlineSnapshot(`
			"import _path from 'path';

			const dir = _path.dirname(import.meta.url);"
		`);
		});

		it('transforms from .cjs -> .mjs', async () => {
			expect(await transform('const dir = __dirname;', { filename: 'file.cjs' }, { format: 'mjs' }))
				.toMatchInlineSnapshot(`
			"import _path from 'path';

			const dir = _path.dirname(import.meta.url);"
		`);
		});

		it('doesnt transform from .ts -> .cjs', async () => {
			expect(
				await transform('const dir = __dirname;', { filename: 'file.ts' }, { format: 'cjs' }),
			).toMatchInlineSnapshot(`"const dir = __dirname;"`);
		});

		it('doesnt transform from .mjs -> .cjs', async () => {
			expect(
				await transform('const dir = __dirname;', { filename: 'file.mjs' }, { format: 'cjs' }),
			).toMatchInlineSnapshot(`"const dir = __dirname;"`);
		});

		it('doesnt transform from .js -> .cjs', async () => {
			expect(
				await transform('const dir = __dirname;', { filename: 'file.js' }, { format: 'cjs' }),
			).toMatchInlineSnapshot(`"const dir = __dirname;"`);
		});

		it('doesnt transform from .cjs -> .cjs', async () => {
			expect(
				await transform('const dir = __dirname;', { filename: 'file.cjs' }, { format: 'cjs' }),
			).toMatchInlineSnapshot(`"const dir = __dirname;"`);
		});
	});

	describe('import.meta.url', () => {
		it('transforms from .ts -> .cjs', async () => {
			expect(
				await transform(
					'const file = import.meta.url;',
					{ filename: 'file.ts' },
					{ format: 'cjs' },
				),
			).toMatchInlineSnapshot(`"const file = __filename;"`);
		});

		it('transforms from .mjs -> .cjs', async () => {
			expect(
				await transform(
					'const file = import.meta.url;',
					{ filename: 'file.mjs' },
					{ format: 'cjs' },
				),
			).toMatchInlineSnapshot(`"const file = __filename;"`);
		});

		it('transforms from .js -> .cjs', async () => {
			expect(
				await transform(
					'const file = import.meta.url;',
					{ filename: 'file.js' },
					{ format: 'cjs' },
				),
			).toMatchInlineSnapshot(`"const file = __filename;"`);
		});

		it('transforms from .cjs -> .cjs', async () => {
			expect(
				await transform(
					'const file = import.meta.url;',
					{ filename: 'file.cjs' },
					{ format: 'cjs' },
				),
			).toMatchInlineSnapshot(`"const file = __filename;"`);
		});

		it('doesnt transform from .ts -> .mjs', async () => {
			expect(
				await transform(
					'const file = import.meta.url;',
					{ filename: 'file.ts' },
					{ format: 'mjs' },
				),
			).toMatchInlineSnapshot(`"const file = import.meta.url;"`);
		});

		it('doesnt transform from .mjs -> .mjs', async () => {
			expect(
				await transform(
					'const file = import.meta.url;',
					{ filename: 'file.mjs' },
					{ format: 'mjs' },
				),
			).toMatchInlineSnapshot(`"const file = import.meta.url;"`);
		});

		it('doesnt transform from .js -> .mjs', async () => {
			expect(
				await transform(
					'const file = import.meta.url;',
					{ filename: 'file.js' },
					{ format: 'mjs' },
				),
			).toMatchInlineSnapshot(`"const file = import.meta.url;"`);
		});

		it('doesnt transform from .cjs -> .mjs', async () => {
			expect(
				await transform(
					'const file = import.meta.url;',
					{ filename: 'file.cjs' },
					{ format: 'mjs' },
				),
			).toMatchInlineSnapshot(`"const file = import.meta.url;"`);
		});

		it('doesnt transform to cjs when wrapped with dirname', async () => {
			expect(
				await transform(
					'const dir1 = path.dirname(import.meta.url); const dir2 = dirname(import.meta.url);',
					{ filename: 'file.ts' },
					{ format: 'cjs' },
				),
			).toMatchInlineSnapshot(`
			"const dir1 = __dirname;
			const dir2 = __dirname;"
		`);
		});
	});

	describe('path.dirname(import.meta.url)', () => {
		it('transforms from .ts -> .cjs', async () => {
			expect(
				await transform(
					'const dir = path.dirname(import.meta.url);',
					{ filename: 'file.ts' },
					{ format: 'cjs' },
				),
			).toMatchInlineSnapshot(`"const dir = __dirname;"`);
		});

		it('transforms from .mjs -> .cjs', async () => {
			expect(
				await transform(
					'const dir = path.dirname(import.meta.url);',
					{ filename: 'file.mjs' },
					{ format: 'cjs' },
				),
			).toMatchInlineSnapshot(`"const dir = __dirname;"`);
		});

		it('transforms from .js -> .cjs', async () => {
			expect(
				await transform(
					'const dir = path.dirname(import.meta.url);',
					{ filename: 'file.js' },
					{ format: 'cjs' },
				),
			).toMatchInlineSnapshot(`"const dir = __dirname;"`);
		});

		it('transforms from .cjs -> .cjs', async () => {
			expect(
				await transform(
					'const dir = path.dirname(import.meta.url);',
					{ filename: 'file.cjs' },
					{ format: 'cjs' },
				),
			).toMatchInlineSnapshot(`"const dir = __dirname;"`);
		});

		it('doesnt transform from .ts -> .mjs', async () => {
			expect(
				await transform(
					'const dir = path.dirname(import.meta.url);',
					{ filename: 'file.ts' },
					{ format: 'mjs' },
				),
			).toMatchInlineSnapshot(`"const dir = path.dirname(import.meta.url);"`);
		});

		it('doesnt transform from .mjs -> .mjs', async () => {
			expect(
				await transform(
					'const dir = path.dirname(import.meta.url);',
					{ filename: 'file.mjs' },
					{ format: 'mjs' },
				),
			).toMatchInlineSnapshot(`"const dir = path.dirname(import.meta.url);"`);
		});

		it('doesnt transform from .js -> .mjs', async () => {
			expect(
				await transform(
					'const dir = path.dirname(import.meta.url);',
					{ filename: 'file.js' },
					{ format: 'mjs' },
				),
			).toMatchInlineSnapshot(`"const dir = path.dirname(import.meta.url);"`);
		});

		it('doesnt transform from .cjs -> .mjs', async () => {
			expect(
				await transform(
					'const dir = path.dirname(import.meta.url);',
					{ filename: 'file.cjs' },
					{ format: 'mjs' },
				),
			).toMatchInlineSnapshot(`"const dir = path.dirname(import.meta.url);"`);
		});

		it('doesnt transform to cjs when not wrapped with dirname', async () => {
			expect(
				await transform(
					'const file = import.meta.url;',
					{ filename: 'file.ts' },
					{ format: 'cjs' },
				),
			).toMatchInlineSnapshot(`"const file = __filename;"`);
		});
	});

	describe('NODE_PATH', () => {
		it('errors if .ts -> .mjs', async () => {
			await expect(
				transform('process.env.NODE_PATH', { filename: 'file.ts' }, { format: 'mjs' }),
			).rejects.toThrow(
				'Environment variable `process.env.NODE_PATH` is not available in modules.',
			);
		});

		it('errors if .mjs -> .mjs', async () => {
			await expect(
				transform('process.env.NODE_PATH', { filename: 'file.mjs' }, { format: 'mjs' }),
			).rejects.toThrow(
				'Environment variable `process.env.NODE_PATH` is not available in modules.',
			);
		});

		it('errors if .js -> .mjs', async () => {
			await expect(
				transform('process.env.NODE_PATH', { filename: 'file.js' }, { format: 'mjs' }),
			).rejects.toThrow(
				'Environment variable `process.env.NODE_PATH` is not available in modules.',
			);
		});

		it('errors if .cjs -> .mjs', async () => {
			await expect(
				transform('process.env.NODE_PATH', { filename: 'file.cjs' }, { format: 'mjs' }),
			).rejects.toThrow(
				'Environment variable `process.env.NODE_PATH` is not available in modules.',
			);
		});

		it('doesnt error if .ts -> .cjs', async () => {
			await expect(
				transform('process.env.NODE_PATH', { filename: 'file.ts' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .mjs -> .cjs', async () => {
			await expect(
				transform('process.env.NODE_PATH', { filename: 'file.mjs' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .js -> .cjs', async () => {
			await expect(
				transform('process.env.NODE_PATH', { filename: 'file.js' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .cjs -> .cjs', async () => {
			await expect(
				transform('process.env.NODE_PATH', { filename: 'file.cjs' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});
	});

	describe('require.extensions', () => {
		it('errors if .ts -> .mjs', async () => {
			await expect(
				transform('require.extensions[".js"] = {};', { filename: 'file.ts' }, { format: 'mjs' }),
			).rejects.toThrow('API `require.extensions` is not available in modules.');
		});

		it('errors if .mjs -> .mjs', async () => {
			await expect(
				transform('require.extensions[".js"] = {};', { filename: 'file.mjs' }, { format: 'mjs' }),
			).rejects.toThrow('API `require.extensions` is not available in modules.');
		});

		it('errors if .js -> .mjs', async () => {
			await expect(
				transform('require.extensions[".js"] = {};', { filename: 'file.js' }, { format: 'mjs' }),
			).rejects.toThrow('API `require.extensions` is not available in modules.');
		});

		it('errors if .cjs -> .mjs', async () => {
			await expect(
				transform('require.extensions[".js"] = {};', { filename: 'file.cjs' }, { format: 'mjs' }),
			).rejects.toThrow('API `require.extensions` is not available in modules.');
		});

		it('doesnt error if .ts -> .cjs', async () => {
			await expect(
				transform('require.extensions[".js"] = {};', { filename: 'file.ts' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .mjs -> .cjs', async () => {
			await expect(
				transform('require.extensions[".js"] = {};', { filename: 'file.mjs' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .js -> .cjs', async () => {
			await expect(
				transform('require.extensions[".js"] = {};', { filename: 'file.js' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .cjs -> .cjs', async () => {
			await expect(
				transform('require.extensions[".js"] = {};', { filename: 'file.cjs' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});
	});

	describe('require.cache', () => {
		it('errors if .ts -> .mjs', async () => {
			await expect(
				transform('require.cache["foo"] = {};', { filename: 'file.ts' }, { format: 'mjs' }),
			).rejects.toThrow('API `require.cache` is not available in modules.');
		});

		it('errors if .mjs -> .mjs', async () => {
			await expect(
				transform('require.cache["foo"] = {};', { filename: 'file.mjs' }, { format: 'mjs' }),
			).rejects.toThrow('API `require.cache` is not available in modules.');
		});

		it('errors if .js -> .mjs', async () => {
			await expect(
				transform('require.cache["foo"] = {};', { filename: 'file.js' }, { format: 'mjs' }),
			).rejects.toThrow('API `require.cache` is not available in modules.');
		});

		it('errors if .cjs -> .mjs', async () => {
			await expect(
				transform('require.cache["foo"] = {};', { filename: 'file.cjs' }, { format: 'mjs' }),
			).rejects.toThrow('API `require.cache` is not available in modules.');
		});

		it('doesnt error if .ts -> .cjs', async () => {
			await expect(
				transform('require.cache["foo"] = {};', { filename: 'file.ts' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .mjs -> .cjs', async () => {
			await expect(
				transform('require.cache["foo"] = {};', { filename: 'file.mjs' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .js -> .cjs', async () => {
			await expect(
				transform('require.cache["foo"] = {};', { filename: 'file.js' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});

		it('doesnt error if .cjs -> .cjs', async () => {
			await expect(
				transform('require.cache["foo"] = {};', { filename: 'file.cjs' }, { format: 'cjs' }),
			).resolves.not.toThrow();
		});
	});
});
