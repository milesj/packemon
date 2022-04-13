import { sortExportConditions } from '../../src/helpers/sortExportConditions';

describe('sortExportConditions()', () => {
	it('sorts in the correct order', () => {
		const map = sortExportConditions({
			default: '',
			script: '',
			import: '',
			node: '',
			require: '',
			types: '',
			browser: '',
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
