import fs from 'node:fs';
import { Path } from '@boost/common';
import { Artifact } from '../src';
import {
	BUILDS_NO_SUPPORT,
	createSnapshotSpies,
	getFixturePath,
	loadPackageAtPath,
} from './helpers';

['babel', 'swc'].forEach((transformer) => {
	describe(`Outputs (${transformer})`, () => {
		describe('artifacts', () => {
			const root = new Path(getFixturePath('project-rollup'));
			const snapshots = createSnapshotSpies(root, true);

			it('builds all the artifacts with rollup', async () => {
				const pkg = loadPackageAtPath(root);

				const index = new Artifact(pkg, [{ format: 'lib' }]);
				index.platform = 'node';
				index.support = 'stable';
				index.inputs = { index: 'src/index.ts' };

				pkg.artifacts.push(index);

				const client = new Artifact(pkg, [{ format: 'lib' }, { format: 'esm' }, { format: 'umd' }]);
				client.platform = 'browser';
				client.support = 'legacy';
				client.inputs = { client: 'src/client/index.ts' };
				client.namespace = 'Packemon';

				pkg.artifacts.push(client);

				const server = new Artifact(pkg, [{ format: 'cjs' }]);
				server.platform = 'node';
				server.support = 'current';
				server.inputs = { server: 'src/server/core.ts' };

				pkg.artifacts.push(server);

				const test = new Artifact(pkg, [{ format: 'lib' }]);
				test.platform = 'native';
				test.support = 'experimental';
				test.inputs = { test: 'src/test-utils/base.ts' };

				pkg.artifacts.push(test);

				await pkg.build({}, {});

				snapshots(pkg).forEach((ss) => {
					expect(ss).toMatchSnapshot();
				});

				expect(index.builds).toMatchSnapshot();
			});
		});

		describe('bundle', () => {
			const root = new Path(getFixturePath('project-bundle'));
			const snapshots = createSnapshotSpies(root, true);

			it('bundles all files into a single file with rollup', async () => {
				const pkg = loadPackageAtPath(root);

				const index = new Artifact(pkg, [{ format: 'lib' }]);
				index.bundle = true;
				index.platform = 'node';
				index.support = 'stable';
				index.inputs = { index: 'src/index.ts' };

				pkg.artifacts.push(index);

				await pkg.build({}, {});

				snapshots(pkg).forEach((ss) => {
					expect(ss).toMatchSnapshot();
				});
			});
		});

		describe('bundle with assets', () => {
			const root = new Path(getFixturePath('project-assets'));
			const snapshots = createSnapshotSpies(root, true);

			BUILDS_NO_SUPPORT.forEach((build) => {
				it(`bundles all files and references assets (${build.platform}, ${build.format})`, async () => {
					const pkg = loadPackageAtPath(root);

					const index = new Artifact(pkg, [{ format: build.format }]);
					index.bundle = true;
					index.platform = build.platform;
					index.support = 'stable';
					index.inputs = { index: 'src/index.ts' };

					pkg.artifacts.push(index);

					await pkg.build({}, {});

					snapshots(pkg).forEach((ss) => {
						expect(ss).toMatchSnapshot();
					});
				});
			});

			it('uses same assets across multiple formats', async () => {
				const pkg = loadPackageAtPath(root);

				const index = new Artifact(pkg, [{ format: 'lib' }, { format: 'esm' }, { format: 'cjs' }]);
				index.bundle = true;
				index.platform = 'node';
				index.support = 'stable';
				index.inputs = { index: 'src/index.ts' };

				pkg.artifacts.push(index);

				await pkg.build({}, {});

				snapshots(pkg).forEach((ss) => {
					expect(ss).toMatchSnapshot();
				});
			});
		});

		describe('no bundle', () => {
			const root = new Path(getFixturePath('project-bundle'));
			const snapshots = createSnapshotSpies(root, true);

			it('creates individual files for every source file', async () => {
				const pkg = loadPackageAtPath(root);

				const index = new Artifact(pkg, [{ format: 'lib' }]);
				index.bundle = false;
				index.platform = 'node';
				index.support = 'stable';
				index.inputs = { index: 'src/index.ts' };

				pkg.artifacts.push(index);

				await pkg.build({}, {});

				snapshots(pkg).forEach((ss) => {
					expect(ss).toMatchSnapshot();
				});
			});
		});

		describe('no bundle with assets', () => {
			const root = new Path(getFixturePath('project-assets'));
			const snapshots = createSnapshotSpies(root, true);

			BUILDS_NO_SUPPORT.forEach((build) => {
				it(`creates individual files and references assets (${build.platform}, ${build.format})`, async () => {
					const pkg = loadPackageAtPath(root);

					const index = new Artifact(pkg, [{ format: build.format }]);
					index.bundle = false;
					index.platform = build.platform;
					index.support = 'stable';
					index.inputs = { index: 'src/index.ts' };

					pkg.artifacts.push(index);

					await pkg.build({}, {});

					snapshots(pkg).forEach((ss) => {
						expect(ss).toMatchSnapshot();
					});
				});
			});
		});
	});
});

describe('Special formats', () => {
	jest.setTimeout(30_000);

	describe('cjs', () => {
		const root = new Path(getFixturePath('project-cjs-compat'));
		const snapshots = createSnapshotSpies(root, true);

		it('supports .ts -> .cjs / .d.cts (compat)', async () => {
			const pkg = loadPackageAtPath(root);

			const index = new Artifact(pkg, [{ declaration: true, format: 'cjs' }]);
			index.bundle = true;
			index.platform = 'node';
			index.support = 'stable';
			index.inputs = { index: 'src/index.ts' };
			index.features = { cjsTypesCompat: true };

			pkg.artifacts.push(index);

			await pkg.build({}, {});

			snapshots(pkg).forEach((ss) => {
				expect(ss).toMatchSnapshot();
			});

			// Declaration snapshots are not captured above because it runs in a child process
			expect(fs.readFileSync(root.append('cjs/index.d.cts').path(), 'utf8')).toMatchSnapshot();
			expect(fs.readFileSync(root.append('cjs/index.d.cts.map').path(), 'utf8')).toMatchSnapshot();
		});
	});

	describe('cts', () => {
		const root = new Path(getFixturePath('project-cts'));
		const snapshots = createSnapshotSpies(root, true);

		it('supports .cts -> .cjs / .d.cts', async () => {
			const pkg = loadPackageAtPath(root);

			const index = new Artifact(pkg, [{ declaration: true, format: 'cjs' }]);
			index.bundle = true;
			index.platform = 'node';
			index.support = 'stable';
			index.inputs = { index: 'src/index.cts' };

			pkg.artifacts.push(index);

			await pkg.build({}, {});

			snapshots(pkg).forEach((ss) => {
				expect(ss).toMatchSnapshot();
			});

			// Declaration snapshots are not captured above because it runs in a child process
			expect(fs.readFileSync(root.append('cjs/index.d.cts').path(), 'utf8')).toMatchSnapshot();
		});
	});

	describe('mts', () => {
		const root = new Path(getFixturePath('project-mts'));
		const snapshots = createSnapshotSpies(root, true);

		it('supports .mts -> .mjs / .d.mts', async () => {
			const pkg = loadPackageAtPath(root);

			const index = new Artifact(pkg, [{ declaration: true, format: 'mjs' }]);
			index.bundle = true;
			index.platform = 'node';
			index.support = 'stable';
			index.inputs = { index: 'src/index.mts' };

			pkg.artifacts.push(index);

			await pkg.build({}, {});

			snapshots(pkg).forEach((ss) => {
				expect(ss).toMatchSnapshot();
			});

			// Declaration snapshots are not captured above because it runs in a child process
			expect(fs.readFileSync(root.append('mjs/index.d.mts').path(), 'utf8')).toMatchSnapshot();
		});
	});
});

describe('Feature flags', () => {
	const root = new Path(getFixturePath('features'));
	const snapshots = createSnapshotSpies(root, true);

	it('compiles', async () => {
		const pkg = loadPackageAtPath(root);

		const babelRuntime = new Artifact(pkg, [{ format: 'lib' }]);
		babelRuntime.bundle = false;
		babelRuntime.platform = 'browser';
		babelRuntime.support = 'legacy';
		babelRuntime.inputs = { index: 'src/helpers.ts' };
		babelRuntime.features = { helpers: 'runtime' };

		pkg.artifacts.push(babelRuntime);

		const babelExternal = new Artifact(pkg, [{ format: 'lib' }]);
		babelExternal.bundle = false;
		babelExternal.platform = 'browser';
		babelExternal.support = 'legacy';
		babelExternal.inputs = { index: 'src/helpers.ts' };
		babelExternal.features = { helpers: 'external' };

		pkg.artifacts.push(babelExternal);

		const swc = new Artifact(pkg, [{ format: 'lib' }]);
		swc.bundle = false;
		swc.platform = 'browser';
		swc.support = 'legacy';
		swc.inputs = { index: 'src/helpers.ts' };
		swc.features = { swc: true };

		pkg.artifacts.push(swc);

		const swcExternal = new Artifact(pkg, [{ format: 'lib' }]);
		swcExternal.bundle = false;
		swcExternal.platform = 'browser';
		swcExternal.support = 'legacy';
		swcExternal.inputs = { index: 'src/helpers.ts' };
		swcExternal.features = { swc: true, helpers: 'external' };

		pkg.artifacts.push(swcExternal);

		await pkg.build({}, {});

		snapshots(pkg).forEach((ss) => {
			if (ss[0].endsWith('.js')) {
				expect(ss).toMatchSnapshot();
			}
		});
	});
});
