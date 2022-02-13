import { rollup } from 'rollup';
import { getFixturePath } from '@boost/test-utils';
import { Packemon } from '../src';
import { createSnapshotSpies } from './helpers';

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
		const root = getFixturePath('config-files-monorepo');
		createSnapshotSpies(root); // Mock fs

		it('inherits config from root and branches', async () => {
			const packemon = new Packemon(root);

			await packemon.build({ configs: true });

			// bar (using push)
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
										features: { workspaces: ['packages/*'] },
										format: 'mjs',
										platform: 'node',
										support: 'stable',
									},
								],
							]),
						}),
						{ name: 'root-plugin' },
						{
							features: { workspaces: ['packages/*'] },
							format: 'mjs',
							name: 'bar-plugin',
							platform: 'node',
							support: 'stable',
						},
					]),
				}),
			);

			// baz (using unshift)
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
							features: { workspaces: ['packages/*'] },
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
										features: { workspaces: ['packages/*'] },
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
										features: { workspaces: ['packages/*'] },
										format: 'mjs',
										platform: 'node',
										support: 'stable',
									},
								],
							]),
						}),
						{ name: 'root-plugin' },
						{
							features: { workspaces: ['packages/*'] },
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

			await packemon.build({ configs: false });

			// bar (using push)
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
										features: { workspaces: ['packages/*'] },
										format: 'mjs',
										platform: 'node',
										support: 'stable',
									},
								],
							]),
						}),
						{ name: 'root-plugin' },
						{
							features: { workspaces: ['packages/*'] },
							format: 'mjs',
							name: 'bar-plugin',
							platform: 'node',
							support: 'stable',
						},
					]),
				}),
			);

			// baz (using unshift)
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
							features: { workspaces: ['packages/*'] },
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
										features: { workspaces: ['packages/*'] },
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
										features: { workspaces: ['packages/*'] },
										format: 'mjs',
										platform: 'node',
										support: 'stable',
									},
								],
							]),
						}),
						{ name: 'root-plugin' },
						{
							features: { workspaces: ['packages/*'] },
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

			await packemon.build({ configs: true });

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

		it('doesnt inherit config if option is false', async () => {
			const packemon = new Packemon(root);

			await packemon.build({ configs: false });

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
