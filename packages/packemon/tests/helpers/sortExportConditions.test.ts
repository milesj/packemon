import { describe, expect, it } from 'vitest';
import { sortExportConditions } from '../../src/helpers/sortExportConditions';

describe('sortExportConditions()', () => {
	it('sorts in the correct order', () => {
		const map = sortExportConditions({
			default: 'index.js',
			script: 'index.js',
			import: 'index.js',
			node: 'index.js',
			require: 'index.js',
			types: 'index.js',
			browser: 'index.js',
		});

		expect(Object.keys(map)).toStrictEqual([
			'types',
			'browser',
			'script',
			'node',
			'import',
			'require',
			'default',
		]);
	});
});
