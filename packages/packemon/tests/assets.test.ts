import type { InputPluginOption } from 'rollup';
import { describe, it, vi } from 'vitest';
import { Path } from '@boost/common';
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';
import { Artifact } from '../src';
import { getFixturePath, loadPackageAtPath, snapshotPackageBuildOutputs } from './helpers';

vi.setConfig({ testTimeout: 30_000 });

describe('vanilla extract', () => {
	it('no bundle + compile', async () => {
		const root = new Path(getFixturePath('project-assets-vanilla'));
		const pkg = loadPackageAtPath(root);

		const index = new Artifact(pkg, [{ format: 'lib' }, { format: 'esm' }]);
		index.bundle = false;
		index.platform = 'browser';
		index.support = 'stable';
		index.inputs = { index: 'src/index.tsx' };

		pkg.artifacts.push(index);

		await pkg.build(
			{ addEntries: false },
			{
				rollupInput(config) {
					(config.plugins as InputPluginOption[]).push(
						vanillaExtractPlugin({
							cwd: root.path(),
						}),
					);
				},
			},
		);

		snapshotPackageBuildOutputs(pkg);
	});

	it('bundle + compile', async () => {
		const root = new Path(getFixturePath('project-assets-vanilla'));
		const pkg = loadPackageAtPath(root);

		const index = new Artifact(pkg, [{ format: 'lib' }, { format: 'esm' }]);
		index.bundle = true;
		index.platform = 'browser';
		index.support = 'stable';
		index.inputs = { index: 'src/index.tsx' };

		pkg.artifacts.push(index);

		await pkg.build(
			{ addEntries: false },
			{
				rollupInput(config) {
					(config.plugins as InputPluginOption[]).push(
						vanillaExtractPlugin({
							cwd: root.path(),
						}),
					);
				},
			},
		);

		snapshotPackageBuildOutputs(pkg);
	});

	it('no bundle + no compile', async () => {
		const root = new Path(getFixturePath('project-assets-vanilla'));
		const pkg = loadPackageAtPath(root);

		const index = new Artifact(pkg, [{ format: 'lib' }, { format: 'esm' }]);
		index.bundle = false;
		index.platform = 'browser';
		index.support = 'stable';
		index.inputs = { index: 'src/index.tsx' };

		pkg.artifacts.push(index);

		await pkg.build({ addEntries: false }, {});

		snapshotPackageBuildOutputs(pkg);
	});

	it('bundle + no compile', async () => {
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
