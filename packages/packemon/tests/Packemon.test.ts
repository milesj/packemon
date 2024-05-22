import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Path } from '@boost/common';
import { Package } from '../src/Package';
import { Packemon } from '../src/Packemon';
import type { BuildOptions } from '../src/types';
import { getFixturePath, loadPackageAtPath } from './helpers';

vi.mock('../src/PackageValidator', () => ({
	PackageValidator: class MockValidator {
		validate = vi.fn(() => this);
	},
}));

describe('Packemon', () => {
	let packemon: Packemon;
	let pkg: Package;

	beforeEach(() => {
		packemon = new Packemon(getFixturePath('project'));
	});

	it('uses working dir', () => {
		const root = Path.create(getFixturePath('project'));

		expect(packemon.workingDir.path()).toBe(root.path());
	});

	describe('build()', () => {
		beforeEach(() => {
			pkg = loadPackageAtPath(packemon.workingDir);
		});

		const options: BuildOptions = {
			addEngines: false,
			addEntries: true,
			addExports: false,
			addFiles: false,
			concurrency: 1,
			declaration: false,
			filter: '',
			filterFormats: '',
			filterPlatforms: '',
			loadConfigs: false,
			quiet: false,
			skipPrivate: false,
			stamp: false,
			timeout: 0,
		};

		it('runs build on package', async () => {
			const spy = vi.spyOn(pkg, 'build').mockImplementation(() => Promise.resolve());

			await packemon.build(pkg, { addEngines: true, concurrency: 3 });

			expect(spy).toHaveBeenCalledWith({ ...options, addEngines: true, concurrency: 3 }, {});
		});

		it('throws if build fails', async () => {
			vi.spyOn(pkg, 'build').mockImplementation(() => {
				throw new Error('Oops');
			});

			await expect(() => packemon.build(pkg, {})).rejects.toThrow('Oops');
		});

		describe('config loading', () => {
			it('inherits for a polyrepo', async () => {
				pkg = loadPackageAtPath(getFixturePath('config-files-polyrepo'));

				const spy = vi.spyOn(pkg, 'build').mockImplementation(() => Promise.resolve());

				await packemon.build(pkg, { loadConfigs: true });

				expect(spy).toHaveBeenCalledWith(
					{ ...options, loadConfigs: true },
					{
						babelInput: expect.any(Function),
						babelOutput: expect.any(Function),
						rollupInput: expect.any(Function),
						rollupOutput: expect.any(Function),
						swc: false,
						swcInput: undefined,
						swcOutput: undefined,
					},
				);
			});

			it('inherits for a monorepo', async () => {
				pkg = loadPackageAtPath(getFixturePath('config-files-monorepo', 'packages/baz'));

				const spy = vi.spyOn(pkg, 'build').mockImplementation(() => Promise.resolve());

				await packemon.build(pkg, { loadConfigs: true });

				expect(spy).toHaveBeenCalledWith(
					{ ...options, loadConfigs: true },
					{
						babelInput: expect.any(Function),
						babelOutput: expect.any(Function),
						rollupInput: expect.any(Function),
						rollupOutput: expect.any(Function),
						swc: false,
						swcInput: undefined,
						swcOutput: undefined,
					},
				);
			});

			it('doesnt inherit if `loadConfigs` is false', async () => {
				pkg = loadPackageAtPath(getFixturePath('config-files-polyrepo'));

				const spy = vi.spyOn(pkg, 'build').mockImplementation(() => Promise.resolve());

				await packemon.build(pkg, { loadConfigs: false });

				expect(spy).toHaveBeenCalledWith({ ...options, loadConfigs: false }, {});
			});
		});
	});

	describe('clean()', () => {
		beforeEach(() => {
			pkg = loadPackageAtPath(packemon.workingDir);
		});

		it('runs clean on package', async () => {
			const spy = vi.spyOn(pkg, 'clean').mockImplementation(() => Promise.resolve());

			await packemon.clean(pkg);

			expect(spy).toHaveBeenCalledWith();
		});
	});

	describe('validate()', () => {
		beforeEach(() => {
			pkg = loadPackageAtPath(packemon.workingDir);
		});

		it('calls a validator on the package', async () => {
			const validator = await packemon.validate(pkg, { deps: false, people: false });

			expect(validator.validate).toHaveBeenCalledWith({
				deps: false,
				engines: true,
				entries: true,
				license: true,
				links: true,
				meta: true,
				people: false,
				quiet: false,
				repo: true,
				skipPrivate: false,
			});
		});
	});

	describe('findPackage()', () => {
		it('errors if no `package.json`', () => {
			packemon = new Packemon(getFixturePath('workspaces', 'no-package'));

			expect(() => packemon.findPackage()).toThrow(
				`No \`package.json\` found in ${packemon.workingDir}.`,
			);
		});

		it('errors for invalid `packemon` config', () => {
			packemon = new Packemon(getFixturePath('workspaces', 'packages/invalid-config'));

			expect(() => packemon.findPackage()).toThrow(
				'Invalid `packemon` configuration for pkg-invalid-config, must be an object or array of objects.',
			);
		});

		it('returns null if package is private and `skipPrivate` is true', () => {
			packemon = new Packemon(getFixturePath('workspace-private'));

			expect(packemon.findPackage({ skipPrivate: true })).toBeNull();
		});

		it('returns null if package does not have a `packemon` config', () => {
			packemon = new Packemon(getFixturePath('workspaces', 'packages/no-config'));

			expect(packemon.findPackage({})).toBeNull();
		});

		it('loads a package with a single `packemon` config', () => {
			packemon = new Packemon(getFixturePath('workspaces', 'packages/valid-object'));
			pkg = packemon.findPackage({})!;

			expect(pkg).toBeInstanceOf(Package);
			expect(pkg.configs).toEqual([
				{
					api: 'public',
					bundle: false,
					externals: [],
					features: { cjsTypesCompat: false, helpers: 'bundled', swc: false },
					formats: ['mjs'],
					inputs: { core: './src/core.ts' },
					namespace: '',
					platform: 'node',
					support: 'stable',
				},
			]);
		});

		it('loads a package with multiple `packemon` configs', () => {
			packemon = new Packemon(getFixturePath('workspaces', 'packages/valid-array'));
			pkg = packemon.findPackage({})!;

			expect(pkg).toBeInstanceOf(Package);
			expect(pkg.configs).toEqual([
				{
					api: 'public',
					bundle: false,
					externals: [],
					features: { cjsTypesCompat: false, helpers: 'bundled', swc: false },
					formats: ['lib'],
					inputs: { index: 'src/index.ts' },
					namespace: '',
					platform: 'node',
					support: 'stable',
				},
				{
					api: 'private',
					bundle: true,
					externals: [],
					features: { cjsTypesCompat: false, helpers: 'bundled', swc: false },
					formats: ['esm'],
					inputs: { index: 'src/index.ts' },
					namespace: '',
					platform: 'browser',
					support: 'current',
				},
			]);
		});
	});

	describe('findPackages()', () => {
		it('errors if no packages are found', async () => {
			packemon = new Packemon(getFixturePath('workspaces-no-packages'));

			await expect(packemon.findPackages({})).rejects.toThrow('No packages found in project.');
		});

		describe('polyrepo', () => {
			it('errors if no workspaces', async () => {
				packemon = new Packemon(getFixturePath('workspace-not-configured'));

				await expect(packemon.findPackages({})).rejects.toThrow(
					'No `workspaces` defined in root `package.json`.',
				);
			});
		});

		describe('monorepo', () => {
			it('returns all packages in project', async () => {
				packemon = new Packemon(getFixturePath('workspaces-configured'));

				const packages = await packemon.findPackages();

				expect(packages).toHaveLength(4);
				expect(packages.map((p) => p.getName()).sort()).toEqual(['bar', 'baz', 'foo', 'qux']);
			});

			it('filters private packages when `skipPrivate` is true', async () => {
				packemon = new Packemon(getFixturePath('workspaces-configured'));

				const packages = await packemon.findPackages({ skipPrivate: true });

				expect(packages).toHaveLength(3);
				expect(packages.map((p) => p.getName()).sort()).toEqual(['bar', 'baz', 'foo']);
			});
		});
	});

	describe('findWorkspaceRoot()', () => {
		it('detects workspace root', () => {
			const root = Path.create(getFixturePath('workspaces'));

			packemon = new Packemon(root);

			expect(packemon.workingDir.path()).toBe(root.path());
			expect(packemon.findWorkspaceRoot().path()).toBe(root.path());
		});

		it('detects workspace root when running in a sub-folder', () => {
			const root = Path.create(getFixturePath('workspaces'));
			const sub = root.append('packages/valid-array');

			packemon = new Packemon(sub);

			expect(packemon.workingDir.path()).toBe(sub.path());
			expect(packemon.findWorkspaceRoot().path()).toBe(root.path());
		});
	});
});
