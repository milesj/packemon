/* eslint-disable unicorn/prefer-module */

import path from 'node:path';
import { rollup } from 'rollup';
import { describe, expect, it, vi } from 'vitest';
import { VirtualPath } from '@boost/common';
import commonjs from '@rollup/plugin-commonjs';
import { copyAndRefAssets } from '../../../src/rollup/plugins/copyAndRefAssets';
import { createStubbedFileSystem } from '../../helpers';

describe('copyAndRefAssets()', () => {
	const fixturePath1 = path.join(__dirname, '__fixtures__/src/components/MyComponent/entry.mjs');
	const fixturePath2 = path.join(
		__dirname,
		'__fixtures__/src/components/AnotherComponent/anotherEntry.mjs',
	);

	it('should fix overlapping paths', async () => {
		const assetsToCopy = {};
		const fs = createStubbedFileSystem();

		const copyRefPlugin = copyAndRefAssets({ dir: '/root/fakeAssets', fs }, assetsToCopy);
		copyRefPlugin.buildStart = vi.fn();
		copyRefPlugin.generateBundle = vi.fn();

		const bundle = await rollup({
			input: { another: fixturePath1, myComponent: fixturePath2 },
			// external: (id) => id.endsWith('.svg'), // treat .svg files as external
			plugins: [commonjs(), copyRefPlugin],
		});

		await bundle.generate({
			dir: 'out',
			format: 'cjs',
		});

		const result = new VirtualPath('/root/fakeAssets/test-e00c9790.svg');
		result.path();

		expect(assetsToCopy).toEqual({
			[path.join(__dirname, '__fixtures__/src/components/MyComponent/MySubComponent/test.svg')]:
				result,
		});
	});
});
