import fs from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { Path } from '@boost/common';
import { Artifact } from '../src';
import { getFixturePath, loadPackageAtPath, snapshotPackageBuildOutputs } from './helpers';

vi.setConfig({ testTimeout: 30_000 });

describe('vanilla extract', () => {
	it('uses same assets across multiple formats', async () => {
		const root = new Path(getFixturePath('project-assets-vanilla'));
		const pkg = loadPackageAtPath(root);

		const index = new Artifact(pkg, [{ format: 'lib' }, { format: 'esm' }]);
		index.bundle = true;
		index.platform = 'browser';
		index.support = 'stable';
		index.inputs = { index: 'src/index.tsx' };

		pkg.artifacts.push(index);

		await pkg.build({ addEntries: false }, {});

		snapshotPackageBuildOutputs(pkg);
	});
});
