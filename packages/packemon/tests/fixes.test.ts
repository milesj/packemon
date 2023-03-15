/* eslint-disable jest/expect-expect */

import fs from 'node:fs';
import { Path } from '@boost/common';
import { PackageExports } from '../src/types';
import { getFixturePath, loadPackageAtPath } from './helpers';

function assertExportsExist(root: Path, exp: PackageExports) {
	Object.keys(exp).forEach((key) => {
		const value = exp[key];

		if (typeof value === 'string') {
			expect(fs.existsSync(root.append(value).path())).toBe(true);
		} else if (value) {
			assertExportsExist(root, value);
		}
	});
}

describe('Bug fixes', () => {
	beforeEach(() => {
		process.env.PACKEMON_TEST_WRITE = 'true';
	});

	afterEach(() => {
		delete process.env.PACKEMON_TEST_WRITE;
	});

	// https://github.com/milesj/packemon/issues/188
	it('fixes #188', async () => {
		const pkg = loadPackageAtPath(new Path(getFixturePath('fixes/188')));
		pkg.generateArtifacts({ declaration: true });

		await pkg.build({ addExports: true, declaration: true }, {});

		assertExportsExist(pkg.path, pkg.json.exports as PackageExports);
	});
});
