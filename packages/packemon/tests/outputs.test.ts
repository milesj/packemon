import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { CodeArtifact } from '../src';
import { createProjectPackage, createSnapshotSpies } from './helpers';

describe('Outputs', () => {
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

			await pkg.build({});

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

			await pkg.build({});

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

			await pkg.build({});

			snapshots(pkg).forEach((ss) => {
				expect(ss).toMatchSnapshot();

				// Check import paths are correct
				if (ss[0].endsWith('index.js')) {
					expect(String(ss[1])).toContain("'../assets/globals-6791a666.css'");
					expect(String(ss[1])).toContain("'../assets/fonts-c6e38a2d.css'");
					expect(String(ss[1])).toContain("'../assets/styles-7ca1a3f0.css'");
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

			await pkg.build({});

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

			await pkg.build({});

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

			await pkg.build({});

			snapshots(pkg).forEach((ss) => {
				expect(ss).toMatchSnapshot();

				// Check import paths are correct
				if (ss[0].endsWith('lib/index.js')) {
					expect(String(ss[1])).toContain("'../assets/globals-6791a666.css'");
					expect(String(ss[1])).toContain("'../assets/fonts-c6e38a2d.css'");
				}

				if (ss[0].endsWith('lib/button/index.js')) {
					expect(String(ss[1])).toContain("'../../assets/styles-7ca1a3f0.css'");
				}
			});
		});
	});
});
