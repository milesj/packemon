import rimraf from 'rimraf';
import { Path } from '@boost/common';
import { mockNormalizedFilePath } from '@boost/common/test';
import { getFixturePath } from '@boost/test-utils';
import { BuildOptions, CodeArtifact, TypesArtifact } from '../src';
import { Package } from '../src/Package';
import { Packemon } from '../src/Packemon';

describe('Packemon', () => {
	let packemon: Packemon;

	beforeEach(() => {
		(rimraf as unknown as jest.Mock).mockImplementation((path: string, cb: Function) => {
			cb();
		});
	});

	describe('generateArtifacts()', () => {
		beforeEach(() => {
			packemon = new Packemon(getFixturePath('workspaces'));
		});

		it('generates build artifacts for each config in a package', async () => {
			const packages = await packemon.loadConfiguredPackages();

			packemon.generateArtifacts(packages);

			expect(packages[0].artifacts).toHaveLength(2);
			expect((packages[0].artifacts[0] as CodeArtifact).inputs).toEqual({ index: 'src/index.ts' });
			expect(packages[0].artifacts[0].builds).toEqual([{ format: 'lib' }]);

			expect((packages[0].artifacts[1] as CodeArtifact).inputs).toEqual({ index: 'src/index.ts' });
			expect(packages[0].artifacts[1].builds).toEqual([{ format: 'esm' }, { format: 'lib' }]);

			expect(packages[1].artifacts).toHaveLength(1);
			expect((packages[1].artifacts[0] as CodeArtifact).inputs).toEqual({ core: './src/core.ts' });
			expect(packages[1].artifacts[0].builds).toEqual([{ format: 'mjs' }]);

			expect(packages[2].artifacts).toHaveLength(1);
			expect((packages[2].artifacts[0] as CodeArtifact).inputs).toEqual({ index: 'src/index.ts' });
			expect(packages[2].artifacts[0].builds).toEqual([
				{ format: 'esm' },
				{ format: 'lib' },
				{ format: 'umd' },
			]);
		});

		it('generates type artifacts for each config in a package', async () => {
			const packages = await packemon.loadConfiguredPackages();

			packemon.generateArtifacts(packages, { declaration: true });

			expect(packages[0].artifacts).toHaveLength(3);
			expect((packages[0].artifacts[2] as TypesArtifact).builds).toEqual([
				{
					inputFile: 'src/index.ts',
					outputName: 'index',
				},
			]);

			expect(packages[1].artifacts).toHaveLength(2);
			expect((packages[1].artifacts[1] as TypesArtifact).builds).toEqual([
				{
					inputFile: './src/core.ts',
					outputName: 'core',
				},
			]);

			expect(packages[2].artifacts).toHaveLength(2);
			expect((packages[2].artifacts[1] as TypesArtifact).builds).toEqual([
				{
					inputFile: 'src/index.ts',
					outputName: 'index',
				},
			]);
		});

		it('generates build artifacts for projects with multiple platforms', async () => {
			packemon = new Packemon(getFixturePath('project-multi-platform'));

			const packages = await packemon.loadConfiguredPackages();

			packemon.generateArtifacts(packages);

			expect(packages[0].artifacts[0].builds).toEqual([{ format: 'esm' }, { format: 'lib' }]);
			expect(packages[0].artifacts[1].builds).toEqual([{ format: 'mjs' }]);
		});

		it('filters formats using `filterFormats`', async () => {
			packemon = new Packemon(getFixturePath('project-multi-platform'));

			const packages = await packemon.loadConfiguredPackages();

			packemon.generateArtifacts(packages, {
				filterFormats: 'esm',
			});

			expect(packages[0].artifacts[0].builds).toEqual([{ format: 'esm' }]);
			expect(packages[0].artifacts[1]).toBeUndefined();
		});

		it('filters platforms using `filterPlatforms`', async () => {
			packemon = new Packemon(getFixturePath('project-multi-platform'));

			const packages = await packemon.loadConfiguredPackages();

			packemon.generateArtifacts(packages, {
				filterPlatforms: 'node',
			});

			expect(packages[0].artifacts[0].builds).toEqual([{ format: 'mjs' }]);
			expect(packages[0].artifacts[1]).toBeUndefined();
		});
	});
});
