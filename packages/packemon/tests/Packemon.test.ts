import rimraf from 'rimraf';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { CodeArtifact, TypesArtifact } from '../src';
import { Package } from '../src/Package';
import { Packemon } from '../src/Packemon';

jest.mock('rimraf');

jest.mock('../src/PackageValidator', () => ({
	PackageValidator: class MockValidator {
		validate = jest.fn(() => this);
	},
}));

describe('Packemon', () => {
	let packemon: Packemon;

	beforeEach(() => {
		(rimraf as unknown as jest.Mock).mockImplementation((path: string, cb: Function) => {
			cb();
		});
	});

	it('runs on cwd by default', () => {
		packemon = new Packemon();

		expect(packemon.root).toEqual(new Path(process.cwd()));
	});

	it('errors with engine version constraint', () => {
		// eslint-disable-next-line jest/require-to-throw-message
		expect(() => new Packemon(getFixturePath('project-constraint'))).toThrow();
	});

	describe('build()', () => {
		let packages: Package[];

		beforeEach(async () => {
			packemon = new Packemon(getFixturePath('workspaces'));
			packages = (await packemon.loadConfiguredPackages()).map((pkg) => {
				jest.spyOn(pkg, 'build').mockImplementation(() => Promise.resolve());

				return pkg;
			});

			jest
				.spyOn(packemon, 'loadConfiguredPackages')
				.mockImplementation(() => Promise.resolve(packages));
		});

		it('calls `build` on each package', async () => {
			await packemon.build({ addEngines: true, concurrency: 3 });

			const options = {
				addEngines: true,
				addExports: false,
				analyze: 'none',
				concurrency: 3,
				declaration: 'none',
				declarationConfig: '',
				filter: '',
				filterFormats: '',
				filterPlatforms: '',
				skipPrivate: false,
				timeout: 0,
			};

			expect(packages[0].build).toHaveBeenCalledWith(options);
			expect(packages[1].build).toHaveBeenCalledWith(options);
			expect(packages[2].build).toHaveBeenCalledWith(options);
		});

		it('emits `onPackageBuilt` for each package', async () => {
			const spy = jest.fn();

			packemon.onPackageBuilt.listen(spy);

			await packemon.build({ addExports: true, skipPrivate: true });

			expect(spy).toHaveBeenCalledWith(packages[0]);
			expect(spy).toHaveBeenCalledWith(packages[1]);
			expect(spy).toHaveBeenCalledWith(packages[2]);
		});

		it('cleans temporary files from each package', async () => {
			// @ts-expect-error Private
			const spy = jest.spyOn(packemon, 'cleanTemporaryFiles');

			await packemon.build({});

			expect(spy).toHaveBeenCalledWith(packages);
		});

		it('throws if a build fails', async () => {
			(packages[1].build as jest.Mock).mockImplementation(() => {
				throw new Error('Oops');
			});

			await expect(() => packemon.build({})).rejects.toThrow('Oops');
		});
	});

	describe('clean()', () => {
		it('handles file system failures', async () => {
			(rimraf as unknown as jest.Mock).mockImplementation((path, cb) => {
				cb(new Error('Missing'));
			});

			packemon = new Packemon(getFixturePath('project'));

			await expect(() => packemon.clean()).rejects.toThrow('Missing');
		});

		describe('polyrepo', () => {
			beforeEach(() => {
				packemon = new Packemon(getFixturePath('project'));
			});

			it('cleans temporary files from each package', async () => {
				// @ts-expect-error Private
				const spy = jest.spyOn(packemon, 'cleanTemporaryFiles');

				await packemon.clean();

				expect(spy).toHaveBeenCalledWith([expect.any(Package)]);
			});

			it('cleans build folders from project', async () => {
				await packemon.clean();

				expect(rimraf).toHaveBeenCalledWith('./{cjs,dts,esm,lib,mjs,umd}', expect.any(Function));
			});
		});

		describe('monorepo', () => {
			beforeEach(() => {
				packemon = new Packemon(getFixturePath('workspaces'));
			});

			it('cleans temporary files from each package', async () => {
				// @ts-expect-error Private
				const spy = jest.spyOn(packemon, 'cleanTemporaryFiles');

				await packemon.clean();

				expect(spy).toHaveBeenCalledWith([
					expect.any(Package),
					expect.any(Package),
					expect.any(Package),
				]);
			});

			it('cleans build folders from project', async () => {
				await packemon.clean();

				expect(rimraf).toHaveBeenCalledWith(
					'packages/*/{cjs,dts,esm,lib,mjs,umd}',
					expect.any(Function),
				);
				expect(rimraf).toHaveBeenCalledWith(
					'other/{cjs,dts,esm,lib,mjs,umd}',
					expect.any(Function),
				);
				expect(rimraf).toHaveBeenCalledWith('misc/{cjs,dts,esm,lib,mjs,umd}', expect.any(Function));
			});
		});
	});

	describe('validate()', () => {
		it('can skip private packages', async () => {
			packemon = new Packemon(getFixturePath('project'));

			const spy = jest.spyOn(packemon, 'loadConfiguredPackages');

			await packemon.validate({ skipPrivate: true });

			expect(spy).toHaveBeenCalledWith(expect.objectContaining({ skipPrivate: true }));

			spy.mockRestore();
		});

		describe('polyrepo', () => {
			beforeEach(() => {
				packemon = new Packemon(getFixturePath('project'));
			});

			it('calls a validator on the package', async () => {
				const validators = await packemon.validate({ deps: false, people: false });

				expect(validators).toHaveLength(1);
				expect(validators[0].validate).toHaveBeenCalledWith({
					deps: false,
					engines: true,
					entries: true,
					files: true,
					license: true,
					links: true,
					meta: true,
					people: false,
					repo: true,
					skipPrivate: false,
				});
			});
		});

		describe('monorepo', () => {
			beforeEach(() => {
				packemon = new Packemon(getFixturePath('workspaces'));
			});

			it('calls a validator on each package', async () => {
				const validators = await packemon.validate({ engines: false, license: false });
				const options = {
					deps: true,
					engines: false,
					entries: true,
					files: true,
					license: false,
					links: true,
					meta: true,
					people: true,
					repo: true,
					skipPrivate: false,
				};

				expect(validators).toHaveLength(3);
				expect(validators[0].validate).toHaveBeenCalledWith(options);
				expect(validators[1].validate).toHaveBeenCalledWith(options);
				expect(validators[2].validate).toHaveBeenCalledWith(options);
			});
		});
	});

	describe('findPackagesInProject()', () => {
		it('errors if no packages are found', async () => {
			packemon = new Packemon(getFixturePath('workspace-private'));

			await expect(packemon.findPackagesInProject({ skipPrivate: true })).rejects.toThrow(
				'No packages found in project.',
			);
		});

		describe('polyrepo', () => {
			it('sets workspaces property to an empty list', async () => {
				packemon = new Packemon(getFixturePath('workspace-not-configured'));

				await packemon.findPackagesInProject();

				expect(packemon.project.workspaces).toEqual([]);
			});

			it('returns project as package', async () => {
				const root = getFixturePath('workspace-not-configured');
				packemon = new Packemon(root);
				const packages = await packemon.findPackagesInProject();

				expect(packages).toHaveLength(1);
				expect(packages).toEqual([
					{
						metadata: packemon.project.createWorkspaceMetadata(new Path(root, 'package.json')),
						package: { name: 'polyrepo' },
					},
				]);
			});
		});

		describe('monorepo', () => {
			it('sets workspaces property to a list of globs', async () => {
				packemon = new Packemon(getFixturePath('workspaces-not-configured'));

				await packemon.findPackagesInProject();

				expect(packemon.project.workspaces).toEqual(['packages/*']);
			});

			it('returns all packages in project', async () => {
				const root = getFixturePath('workspaces-not-configured');
				packemon = new Packemon(root);
				const packages = await packemon.findPackagesInProject();

				expect(packages).toHaveLength(4);
				expect(packages).toEqual([
					{
						metadata: packemon.project.createWorkspaceMetadata(
							new Path(root, 'packages/bar/package.json'),
						),
						package: { name: 'bar' },
					},
					{
						metadata: packemon.project.createWorkspaceMetadata(
							new Path(root, 'packages/baz/package.json'),
						),
						package: { name: 'baz' },
					},
					{
						metadata: packemon.project.createWorkspaceMetadata(
							new Path(root, 'packages/foo/package.json'),
						),
						package: { name: 'foo' },
					},
					{
						metadata: packemon.project.createWorkspaceMetadata(
							new Path(root, 'packages/qux/package.json'),
						),
						package: { name: 'qux', private: true },
					},
				]);
			});

			it('filters private packages when `skipPrivate` is true', async () => {
				const root = getFixturePath('workspaces-not-configured');
				packemon = new Packemon(root);
				const packages = await packemon.findPackagesInProject({ skipPrivate: true });

				expect(packages).toHaveLength(3);
				expect(packages.find((pkg) => pkg.package.name === 'qux')).toBeUndefined();
			});
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
			expect(packages[0].artifacts[1].builds).toEqual([{ format: 'lib' }, { format: 'esm' }]);

			expect(packages[1].artifacts).toHaveLength(1);
			expect((packages[1].artifacts[0] as CodeArtifact).inputs).toEqual({ core: './src/core.ts' });
			expect(packages[1].artifacts[0].builds).toEqual([{ format: 'mjs' }]);

			expect(packages[2].artifacts).toHaveLength(1);
			expect((packages[2].artifacts[0] as CodeArtifact).inputs).toEqual({ index: 'src/index.ts' });
			expect(packages[2].artifacts[0].builds).toEqual([
				{ format: 'lib' },
				{ format: 'esm' },
				{ format: 'umd' },
			]);
		});

		it('generates "standard" type artifacts for each config in a package', async () => {
			const packages = await packemon.loadConfiguredPackages();

			packemon.generateArtifacts(packages, { declaration: 'standard' });

			expect(packages[0].artifacts).toHaveLength(3);
			expect((packages[0].artifacts[2] as TypesArtifact).declarationType).toBe('standard');
			expect((packages[0].artifacts[2] as TypesArtifact).builds).toEqual([
				{
					inputFile: 'src/index.ts',
					outputName: 'index',
				},
			]);

			expect(packages[1].artifacts).toHaveLength(2);
			expect((packages[1].artifacts[1] as TypesArtifact).declarationType).toBe('standard');
			expect((packages[1].artifacts[1] as TypesArtifact).builds).toEqual([
				{
					inputFile: './src/core.ts',
					outputName: 'core',
				},
			]);

			expect(packages[2].artifacts).toHaveLength(2);
			expect((packages[2].artifacts[1] as TypesArtifact).declarationType).toBe('standard');
			expect((packages[2].artifacts[1] as TypesArtifact).builds).toEqual([
				{
					inputFile: 'src/index.ts',
					outputName: 'index',
				},
			]);
		});

		it('generates "api" type artifacts for each config in a package', async () => {
			const packages = await packemon.loadConfiguredPackages();

			packemon.generateArtifacts(packages, { declaration: 'api' });

			expect(packages[0].artifacts).toHaveLength(3);
			expect((packages[0].artifacts[2] as TypesArtifact).declarationType).toBe('api');
			expect((packages[0].artifacts[2] as TypesArtifact).builds).toEqual([
				{
					inputFile: 'src/index.ts',
					outputName: 'index',
				},
			]);

			expect(packages[1].artifacts).toHaveLength(2);
			expect((packages[1].artifacts[1] as TypesArtifact).declarationType).toBe('api');
			expect((packages[1].artifacts[1] as TypesArtifact).builds).toEqual([
				{
					inputFile: './src/core.ts',
					outputName: 'core',
				},
			]);

			expect(packages[2].artifacts).toHaveLength(2);
			expect((packages[2].artifacts[1] as TypesArtifact).declarationType).toBe('api');
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

			expect(packages[0].artifacts[0].builds).toEqual([{ format: 'lib' }, { format: 'esm' }]);
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

	describe('loadConfiguredPackages()', () => {
		beforeEach(() => {
			packemon = new Packemon(getFixturePath('workspaces'));
		});

		it('returns the same reference because of memoization', async () => {
			expect(await packemon.loadConfiguredPackages()).toBe(await packemon.loadConfiguredPackages());
		});

		it('returns all configured packages', async () => {
			const packages = await packemon.loadConfiguredPackages();

			expect(packages).toHaveLength(3);
			expect(packages.map((pkg) => pkg.getName())).toEqual([
				'pkg-valid-array',
				'pkg-valid-object',
				'pkg-valid-object-private',
			]);
		});

		it('sets configs for each valid package', async () => {
			const [one, two, three] = await packemon.loadConfiguredPackages();

			expect(one.getName()).toBe('pkg-valid-array');
			expect(one.configs).toEqual([
				{
					bundle: false,
					externals: [],
					formats: ['lib'],
					inputs: { index: 'src/index.ts' },
					namespace: '',
					platform: 'node',
					support: 'stable',
				},
				{
					bundle: true,
					externals: [],
					formats: ['lib', 'esm'],
					inputs: { index: 'src/index.ts' },
					namespace: '',
					platform: 'browser',
					support: 'current',
				},
			]);

			expect(two.getName()).toBe('pkg-valid-object');
			expect(two.configs).toEqual([
				{
					bundle: false,
					externals: [],
					formats: ['mjs'],
					inputs: { core: './src/core.ts' },
					namespace: '',
					platform: 'node',
					support: 'stable',
				},
			]);

			expect(three.getName()).toBe('pkg-valid-object-private');
			expect(three.configs).toEqual([
				{
					bundle: true,
					externals: [],
					formats: ['lib', 'esm', 'umd'],
					inputs: { index: 'src/index.ts' },
					namespace: 'Test',
					platform: 'browser',
					support: 'stable',
				},
			]);
		});

		it('filters private packages when `skipPrivate` is true', async () => {
			const packages = await packemon.loadConfiguredPackages({ skipPrivate: true });

			expect(packages.map((pkg) => pkg.getName())).toEqual(['pkg-valid-array', 'pkg-valid-object']);
		});

		it('filters packages using a pattern with `filterPackages`', async () => {
			const packages = await packemon.loadConfiguredPackages({ filter: 'pkg-*-object' });

			expect(packages.map((pkg) => pkg.getName())).toEqual(['pkg-valid-object']);
		});

		it('filters packages using a comma separate list with `filterPackages`', async () => {
			const packages = await packemon.loadConfiguredPackages({
				filter: 'pkg-valid-obj*,pkg-*-config',
				skipPrivate: true,
			});

			expect(packages.map((pkg) => pkg.getName())).toEqual(['pkg-valid-object']);
		});

		it('filters packages that are missing a `packemon` config', async () => {
			const packages = await packemon.loadConfiguredPackages();

			expect(packages.map((pkg) => pkg.getName())).toEqual([
				'pkg-valid-array',
				'pkg-valid-object',
				'pkg-valid-object-private',
			]);
		});

		it('filters packages where `packemon` config is invalid', async () => {
			const packages = await packemon.loadConfiguredPackages();

			expect(packages.map((pkg) => pkg.getName())).toEqual([
				'pkg-valid-array',
				'pkg-valid-object',
				'pkg-valid-object-private',
			]);
		});

		it('emits `onPackagesLoaded` event', async () => {
			const spy = jest.fn();

			packemon.onPackagesLoaded.listen(spy);

			await packemon.loadConfiguredPackages();

			expect(spy).toHaveBeenCalledWith([
				expect.any(Package),
				expect.any(Package),
				expect.any(Package),
			]);
		});
	});
});
