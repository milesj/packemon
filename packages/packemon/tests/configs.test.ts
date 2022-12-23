import { rollup } from 'rollup';
import { Path } from '@boost/common';
import { Packemon } from '../src';
import { createSnapshotSpies, getFixturePath, loadPackageAtPath } from './helpers';

jest.mock('execa');

jest.mock('rollup', () => ({
	...jest.requireActual('rollup'),
	rollup: jest.fn(),
}));

jest.mock('@rollup/plugin-babel', () => ({
	...jest.requireActual('@rollup/plugin-babel'),
	// Pipe options through so we can inspect them
	getBabelInputPlugin: (opts: object) => ({ name: '@rollup/plugin-babel-input', ...opts }),
	getBabelOutputPlugin: (opts: object) => ({ name: '@rollup/plugin-babel-output', ...opts }),
}));

describe('Config files', () => {
	let rollupSpy: jest.Mock;
	let generateSpy: jest.Mock;

	beforeEach(() => {
		generateSpy = jest.fn(() => ({ output: [] }));
		rollupSpy = jest.fn(() => ({ generate: generateSpy }));

		(rollup as unknown as jest.SpyInstance).mockImplementation(rollupSpy);
	});

	describe('monorepo', () => {
		const root = Path.create(getFixturePath('config-files-monorepo'));

		createSnapshotSpies(root); // Mock fs

		it('inherits config from root and branches', async () => {
			const packemon = new Packemon(root);

			// bar (using push)
			await packemon.build(loadPackageAtPath(root.append('packages/bar'), root), {
				loadConfigs: true,
			});

			expect(rollupSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						expect.objectContaining({
							name: '@rollup/plugin-babel-input',
							plugins: expect.arrayContaining(['babel-plugin-bar']),
						}),
						{ name: 'rollup-plugin-root' },
						{ name: 'rollup-plugin-bar' },
					]),
				}),
			);
			expect(generateSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						expect.objectContaining({
							name: '@rollup/plugin-babel-output',
							plugins: expect.arrayContaining([
								'root-plugin',
								[
									'bar-plugin',
									{
										features: expect.any(Object),
										format: 'mjs',
										platform: 'node',
										support: 'stable',
									},
								],
							]),
						}),
						{ name: 'root-plugin' },
						{
							features: expect.any(Object),
							format: 'mjs',
							name: 'bar-plugin',
							platform: 'node',
							support: 'stable',
						},
					]),
				}),
			);

			// baz (using unshift)
			await packemon.build(loadPackageAtPath(root.append('packages/baz'), root), {
				loadConfigs: true,
			});

			expect(rollupSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						{ name: 'rollup-plugin-baz' },
						expect.objectContaining({
							name: '@rollup/plugin-babel-input',
							plugins: expect.arrayContaining(['babel-plugin-baz']),
						}),
						{ name: 'rollup-plugin-root' },
					]),
				}),
			);
			expect(generateSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						{
							features: expect.any(Object),
							format: 'lib',
							name: 'baz-plugin',
							platform: 'browser',
							support: 'stable',
						},
						expect.objectContaining({
							name: '@rollup/plugin-babel-output',
							plugins: expect.arrayContaining([
								[
									'baz-plugin',
									{
										features: expect.any(Object),
										format: 'lib',
										platform: 'browser',
										support: 'stable',
									},
								],
								'root-plugin',
							]),
						}),
						{ name: 'root-plugin' },
					]),
				}),
			);

			// foo (using push)
			await packemon.build(loadPackageAtPath(root.append('packages/foo'), root), {
				loadConfigs: true,
			});

			expect(rollupSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						expect.objectContaining({
							name: '@rollup/plugin-babel-input',
							plugins: expect.arrayContaining(['babel-plugin-foo']),
						}),
						{ name: 'rollup-plugin-root' },
						{ name: 'rollup-plugin-foo' },
					]),
				}),
			);
			expect(generateSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						expect.objectContaining({
							name: '@rollup/plugin-babel-output',
							plugins: expect.arrayContaining([
								'root-plugin',
								[
									'foo-plugin',
									{
										features: expect.any(Object),
										format: 'mjs',
										platform: 'node',
										support: 'stable',
									},
								],
							]),
						}),
						{ name: 'root-plugin' },
						{
							features: expect.any(Object),
							format: 'mjs',
							name: 'foo-plugin',
							platform: 'node',
							support: 'stable',
						},
					]),
				}),
			);
		});

		it('doesnt inherit config if option is false', async () => {
			const packemon = new Packemon(root);

			// bar (using push)
			await packemon.build(loadPackageAtPath(root.append('packages/bar'), root), {
				loadConfigs: false,
			});

			expect(rollupSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						expect.objectContaining({
							name: '@rollup/plugin-babel-input',
							plugins: expect.arrayContaining(['babel-plugin-bar']),
						}),
						{ name: 'rollup-plugin-root' },
						{ name: 'rollup-plugin-bar' },
					]),
				}),
			);
			expect(generateSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						expect.objectContaining({
							name: '@rollup/plugin-babel-output',
							plugins: expect.arrayContaining([
								'root-plugin',
								[
									'bar-plugin',
									{
										features: expect.any(Object),
										format: 'mjs',
										platform: 'node',
										support: 'stable',
									},
								],
							]),
						}),
						{ name: 'root-plugin' },
						{
							features: expect.any(Object),
							format: 'mjs',
							name: 'bar-plugin',
							platform: 'node',
							support: 'stable',
						},
					]),
				}),
			);

			// baz (using unshift)
			await packemon.build(loadPackageAtPath(root.append('packages/baz'), root), {
				loadConfigs: false,
			});

			expect(rollupSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						{ name: 'rollup-plugin-baz' },
						expect.objectContaining({
							name: '@rollup/plugin-babel-input',
							plugins: expect.arrayContaining(['babel-plugin-baz']),
						}),
						{ name: 'rollup-plugin-root' },
					]),
				}),
			);
			expect(generateSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						{
							features: expect.any(Object),
							format: 'lib',
							name: 'baz-plugin',
							platform: 'browser',
							support: 'stable',
						},
						expect.objectContaining({
							name: '@rollup/plugin-babel-output',
							plugins: expect.arrayContaining([
								[
									'baz-plugin',
									{
										features: expect.any(Object),
										format: 'lib',
										platform: 'browser',
										support: 'stable',
									},
								],
								'root-plugin',
							]),
						}),
						{ name: 'root-plugin' },
					]),
				}),
			);

			// foo (using push)
			await packemon.build(loadPackageAtPath(root.append('packages/foo'), root), {
				loadConfigs: false,
			});

			expect(rollupSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						expect.objectContaining({
							name: '@rollup/plugin-babel-input',
							plugins: expect.arrayContaining(['babel-plugin-foo']),
						}),
						{ name: 'rollup-plugin-root' },
						{ name: 'rollup-plugin-foo' },
					]),
				}),
			);
			expect(generateSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						expect.objectContaining({
							name: '@rollup/plugin-babel-output',
							plugins: expect.arrayContaining([
								'root-plugin',
								[
									'foo-plugin',
									{
										features: expect.any(Object),
										format: 'mjs',
										platform: 'node',
										support: 'stable',
									},
								],
							]),
						}),
						{ name: 'root-plugin' },
						{
							features: expect.any(Object),
							format: 'mjs',
							name: 'foo-plugin',
							platform: 'node',
							support: 'stable',
						},
					]),
				}),
			);
		});
	});

	describe('polyrepo', () => {
		const root = getFixturePath('config-files-polyrepo');

		createSnapshotSpies(root); // Mock fs

		it('inherits config from root and branches', async () => {
			const packemon = new Packemon(root);

			await packemon.build(loadPackageAtPath(root), {
				loadConfigs: true,
			});

			// input
			expect(rollupSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						expect.objectContaining({
							name: '@rollup/plugin-babel-input',
							plugins: expect.arrayContaining(['poly-plugin-input']),
						}),
						{ name: 'poly-plugin-input' },
					]),
				}),
			);

			// output
			expect(generateSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						{
							name: 'poly-plugin-output',
							features: expect.any(Object),
							format: 'lib',
							platform: 'browser',
							support: 'stable',
						},
						expect.objectContaining({
							name: '@rollup/plugin-babel-output',
							plugins: expect.arrayContaining([
								[
									'poly-plugin-output',
									{
										features: expect.any(Object),
										format: 'lib',
										platform: 'browser',
										support: 'stable',
									},
								],
							]),
						}),
					]),
				}),
			);
		});

		it('doesnt inherit config if option is false', async () => {
			const packemon = new Packemon(root);

			await packemon.build(loadPackageAtPath(root), {
				loadConfigs: false,
			});

			// input
			expect(rollupSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						expect.objectContaining({
							name: '@rollup/plugin-babel-input',
							plugins: expect.arrayContaining(['poly-plugin-input']),
						}),
						{ name: 'poly-plugin-input' },
					]),
				}),
			);

			// output
			expect(generateSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: expect.arrayContaining([
						{
							name: 'poly-plugin-output',
							features: {},
							format: 'lib',
							platform: 'browser',
							support: 'stable',
						},
						expect.objectContaining({
							name: '@rollup/plugin-babel-output',
							plugins: expect.arrayContaining([
								[
									'poly-plugin-output',
									{
										features: {},
										format: 'lib',
										platform: 'browser',
										support: 'stable',
									},
								],
							]),
						}),
					]),
				}),
			);
		});
	});
});
