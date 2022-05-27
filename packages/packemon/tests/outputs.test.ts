/* eslint-disable jest/no-conditional-in-test */

import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { CodeArtifact, TypesArtifact } from '../src';
import { createProjectPackage, createSnapshotSpies } from './helpers';

['babel', 'swc'].forEach((transformer) => {
	describe(`Outputs (${transformer})`, () => {
		describe('artifacts', () => {
			const root = new Path(getFixturePath('project-rollup'));
			const snapshots = createSnapshotSpies(root, true);

			it('builds all the artifacts with rollup', async () => {
				const pkg = createProjectPackage(root);

				const index = new CodeArtifact(pkg, [{ format: 'lib' }]);
				index.platform = 'node';
				index.support = 'stable';
				index.inputs = { index: 'src/index.ts' };

				pkg.addArtifact(index);

				const client = new CodeArtifact(pkg, [
					{ format: 'lib' },
					{ format: 'esm' },
					{ format: 'umd' },
				]);
				client.platform = 'browser';
				client.support = 'legacy';
				client.inputs = { client: 'src/client/index.ts' };
				client.namespace = 'Packemon';

				pkg.addArtifact(client);

				const server = new CodeArtifact(pkg, [{ format: 'cjs' }]);
				server.platform = 'node';
				server.support = 'current';
				server.inputs = { server: 'src/server/core.ts' };

				pkg.addArtifact(server);

				const test = new CodeArtifact(pkg, [{ format: 'lib' }]);
				test.platform = 'native';
				test.support = 'experimental';
				test.inputs = { test: 'src/test-utils/base.ts' };

				pkg.addArtifact(test);

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
				const pkg = createProjectPackage(root);

				const index = new CodeArtifact(pkg, [{ format: 'lib' }]);
				index.bundle = true;
				index.platform = 'node';
				index.support = 'stable';
				index.inputs = { index: 'src/index.ts' };

				pkg.addArtifact(index);

				await pkg.build({}, {});

				snapshots(pkg).forEach((ss) => {
					expect(ss).toMatchSnapshot();
				});
			});
		});

		describe('bundle with assets', () => {
			const root = new Path(getFixturePath('project-assets'));
			const snapshots = createSnapshotSpies(root, true);

			it('bundles all files and references assets', async () => {
				const pkg = createProjectPackage(root);

				const index = new CodeArtifact(pkg, [{ format: 'lib' }]);
				index.bundle = true;
				index.platform = 'node';
				index.support = 'stable';
				index.inputs = { index: 'src/index.ts' };

				pkg.addArtifact(index);

				await pkg.build({}, {});

				snapshots(pkg).forEach((ss) => {
					expect(ss).toMatchSnapshot();

					// Check import paths are correct
					if (ss[0].endsWith('index.js')) {
						expect(String(ss[1])).toContain("'../assets/globals-107ab52e.css'");
						expect(String(ss[1])).toContain("'../assets/fonts-4e5dc96c.css'");
						expect(String(ss[1])).toContain("'../assets/styles-b11c3a83.css'");
					}
				});
			});

			it('uses same assets across multiple formats', async () => {
				const pkg = createProjectPackage(root);

				const index = new CodeArtifact(pkg, [
					{ format: 'lib' },
					{ format: 'esm' },
					{ format: 'cjs' },
				]);
				index.bundle = true;
				index.platform = 'node';
				index.support = 'stable';
				index.inputs = { index: 'src/index.ts' };

				pkg.addArtifact(index);

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
				const pkg = createProjectPackage(root);

				const index = new CodeArtifact(pkg, [{ format: 'lib' }]);
				index.bundle = false;
				index.platform = 'node';
				index.support = 'stable';
				index.inputs = { index: 'src/index.ts' };

				pkg.addArtifact(index);

				await pkg.build({}, {});

				snapshots(pkg).forEach((ss) => {
					expect(ss).toMatchSnapshot();
				});
			});
		});

		describe('no bundle with assets', () => {
			const root = new Path(getFixturePath('project-assets'));
			const snapshots = createSnapshotSpies(root, true);

			it('creates individual files and references assets', async () => {
				const pkg = createProjectPackage(root);

				const index = new CodeArtifact(pkg, [{ format: 'lib' }]);
				index.bundle = false;
				index.platform = 'node';
				index.support = 'stable';
				index.inputs = { index: 'src/index.ts' };

				pkg.addArtifact(index);

				await pkg.build({}, {});

				snapshots(pkg).forEach((ss) => {
					expect(ss).toMatchSnapshot();

					// Check import paths are correct
					if (ss[0].endsWith('lib/index2.js')) {
						expect(String(ss[1])).toContain("'../assets/globals-107ab52e.css'");
						expect(String(ss[1])).toContain("'../assets/fonts-4e5dc96c.css'");
					}

					if (ss[0].endsWith('lib/button/index2.js')) {
						expect(String(ss[1])).toContain("'../../assets/styles-b11c3a83.css'");
					}
				});
			});
		});
	});
});

describe.only('Special formats', () => {
	describe('cts', () => {
		const root = new Path(getFixturePath('project-cts'));
		const snapshots = createSnapshotSpies(root, true);

		it('supports .cts -> .cjs / .d.cts', async () => {
			const pkg = createProjectPackage(root);

			const index = new CodeArtifact(pkg, [{ format: 'cjs' }]);
			index.bundle = true;
			index.platform = 'node';
			index.support = 'stable';
			index.inputs = { index: 'src/index.cts' };

			pkg.addArtifact(index);

			const types = new TypesArtifact(pkg, [{ inputFile: 'src/index.cts', outputName: 'index' }]);

			pkg.addArtifact(types);

			await pkg.build({}, {});

			snapshots(pkg).forEach((ss) => {
				expect(ss).toMatchSnapshot();
			});
		});
	});
});
