import path from 'node:path';
import { InputOption, rollup } from 'rollup';
import { describe, expect, it, vi } from 'vitest';
import { VirtualPath } from '@boost/common';
import commonjs from '@rollup/plugin-commonjs';
import { copyAndRefAssets } from '../../../src/rollup/plugins/copyAndRefAssets';

async function transform(
	input: InputOption,
	assetsToCopy: Record<string, VirtualPath>,
): Promise<string> {
	const copyRefPlugin = copyAndRefAssets({ dir: '/root/fakeAssets' }, assetsToCopy);
	copyRefPlugin.buildStart = () => Promise.resolve();
	copyRefPlugin.generateBundle = () => Promise.resolve();

	const bundle = await rollup({
		input,
		external: (id) => id.endsWith('.svg'), // treat .svg files as external
		plugins: [commonjs(), copyRefPlugin],
	});

	const { output } = await bundle.generate({
		dir: 'out',
		format: 'cjs',
	});

	return output[0].code || '';
}

vi.mock('fs', async (importOriginal) => {
	const originalFs = await importOriginal<typeof import('fs')>();

	return {
		__esModule: true,
		default: {
			...originalFs,
			mkdir: vi.fn(),
			readFileSync: vi.fn((p, options) => {
				if (typeof p === 'string' && p.endsWith('.svg')) {
					return 'Mock SVG Content';
				}
				return originalFs.readFileSync(p, options);
			}),
		},
	};
});

describe('copyAndRefAssets()', () => {
	// eslint-disable-next-line unicorn/prefer-module
	const fixturePath1 = path.join(__dirname, '__fixtures__/src/components/MyComponent/entry.mjs');
	const fixturePath2 = path.join(
		// eslint-disable-next-line unicorn/prefer-module
		__dirname,
		'__fixtures__/src/components/AnotherComponent/anotherEntry.mjs',
	);

	// TODO
	// it('Should fix overlapping paths', async () => {
	// 	const assetsToCopy = {};
	// 	await transform({ another: fixturePath1, myComponent: fixturePath2 }, assetsToCopy);

	// 	expect(Object.keys(assetsToCopy)[0]).toMatch(
	// 		'packemon/tests/rollup/plugins/__fixtures__/src/components/MyComponent/MySubComponent/icons/test.svg',
	// 	);
	// });
});
