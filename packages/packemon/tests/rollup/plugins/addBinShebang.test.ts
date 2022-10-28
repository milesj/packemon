import path from 'node:path';
import { InputOption, OutputOptions, rollup } from 'rollup';
import { addBinShebang } from '../../../src/rollup/plugins/addBinShebang';

async function transform(input: InputOption, options: OutputOptions = {}): Promise<string> {
	const bundle = await rollup({
		input,
	});

	const { output } = await bundle.generate({
		dir: 'out',
		format: 'cjs',
		plugins: [addBinShebang()],
		...options,
	});

	return output[0].code || '';
}

describe('addBinShebang()', () => {
	// eslint-disable-next-line unicorn/prefer-module
	const fixturePath = path.join(__dirname, '__fixtures__/bin.ts');

	it('doesnt add shebang if filename doesnt contain bin', async () => {
		const code = await transform({ index: fixturePath });

		expect(code).not.toContain('#!/usr/bin/env node\n');
	});

	it('adds shebang to "bin.js"', async () => {
		const code = await transform({ bin: fixturePath });

		expect(code).toContain('#!/usr/bin/env node\n');
	});

	it('adds shebang to "bin.cjs"', async () => {
		const code = await transform(
			{ bin: fixturePath },
			{
				entryFileNames: '[name].cjs',
			},
		);

		expect(code).toContain('#!/usr/bin/env node\n');
	});

	it('adds shebang to "bin.mjs"', async () => {
		const code = await transform(
			{ bin: fixturePath },
			{
				entryFileNames: '[name].mjs',
			},
		);

		expect(code).toContain('#!/usr/bin/env node\n');
	});

	it('doesnt add shebang to "bin.ts" (invalid)', async () => {
		const code = await transform(
			{ index: fixturePath },
			{
				entryFileNames: '[name].ts',
			},
		);

		expect(code).not.toContain('#!/usr/bin/env node\n');
	});

	it('adds shebang when bin is in a subfolder', async () => {
		const code = await transform({ 'sub/bin': fixturePath });

		expect(code).toContain('#!/usr/bin/env node\n');
	});
});
