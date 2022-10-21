import { rollup } from 'rollup';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { CodeArtifact } from '../src/CodeArtifact';
import { Package } from '../src/Package';
import { Project } from '../src/Project';
import { getRollupConfig } from '../src/rollup/config';
import { mockSpy } from './helpers';

jest.mock('../src/rollup/config', () => ({
	getRollupConfig: jest.fn(() => ({
		input: true,
		output: [
			{ originalFormat: 'lib', a: true },
			{ originalFormat: 'esm', b: true },
			{ originalFormat: 'mjs', c: true },
		],
	})),
}));

jest.mock('fs-extra');
jest.mock('rollup', () => ({ rollup: jest.fn() }));

describe('CodeArtifact', () => {
	const fixturePath = new Path(getFixturePath('project'));
	const packageJson = {
		name: 'project',
		version: '0.0.0',
		packemon: {},
	};
	let artifact: CodeArtifact;

	beforeEach(() => {
		artifact = new CodeArtifact(
			new Package(new Project(fixturePath), fixturePath, { ...packageJson }),
			[],
		);
		artifact.startup();
	});

	describe('build()', () => {
		let bundleWriteSpy: jest.SpyInstance;

		beforeEach(() => {
			bundleWriteSpy = jest.fn(() => ({ output: [{ type: 'chunk', code: 'code' }] }));

			mockSpy(rollup)
				.mockReset()
				.mockImplementation(() => ({
					cache: { cache: true },
					generate: bundleWriteSpy,
					write: bundleWriteSpy,
				}));

			jest
				.spyOn(artifact.package, 'getFeatureFlags')
				.mockImplementation(() => ({ typescript: true }));

			artifact.builds.push({ format: 'lib' }, { format: 'cjs' }, { format: 'esm' });
		});

		it('generates rollup config using input config', async () => {
			await artifact.build({}, {});

			expect(getRollupConfig).toHaveBeenCalledWith(
				artifact,
				{ typescript: true },
				expect.any(Object),
			);
			expect(rollup).toHaveBeenCalledWith({
				input: true,
				onwarn: expect.any(Function),
			});
		});

		it('sets rollup cache on artifact', async () => {
			expect(artifact.cache).toBeUndefined();

			await artifact.build({}, {});

			expect(artifact.cache).toEqual({ cache: true });
		});

		it('writes a bundle and stats for each build', async () => {
			await artifact.build({}, {});

			expect(bundleWriteSpy).toHaveBeenCalledWith({ a: true });
			expect(artifact.builds[0].stats?.size).toBe(4);

			expect(bundleWriteSpy).toHaveBeenCalledWith({ b: true });
			expect(artifact.builds[1].stats?.size).toBe(4);

			expect(bundleWriteSpy).toHaveBeenCalledWith({ c: true });
			expect(artifact.builds[2].stats?.size).toBe(4);
		});
	});

	describe('getPackageExports()', () => {
		it('adds exports based on input file and output name', () => {
			artifact.builds.push({ format: 'lib' });

			expect(artifact.getPackageExports()).toEqual({
				'.': {
					node: './lib/index.js',
					default: './lib/index.js',
				},
			});
		});

		it('adds exports based on input file and output name when shared lib required', () => {
			artifact.sharedLib = true;
			artifact.builds.push({ format: 'lib' });

			expect(artifact.getPackageExports()).toEqual({
				'.': {
					node: './lib/node/index.js',
					default: './lib/node/index.js',
				},
			});
		});

		it('supports subpath file exports when output name is not "index"', () => {
			artifact.inputs = { sub: './src/sub.ts' };
			artifact.builds.push({ format: 'lib' });

			expect(artifact.getPackageExports()).toEqual({
				'./sub': {
					node: './lib/sub.js',
					default: './lib/sub.js',
				},
			});
		});

		it('supports conditional exports when there are multiple builds', () => {
			artifact.builds.push({ format: 'lib' }, { format: 'mjs' }, { format: 'cjs' });

			expect(artifact.getPackageExports()).toEqual({
				'.': {
					node: {
						import: './mjs/index.mjs',
						require: './cjs/index.cjs',
					},
					default: './lib/index.js',
				},
			});
		});

		it('skips `default` export when there is no `lib` build', () => {
			artifact.inputs = { sub: './src/sub.ts' };
			artifact.builds.push({ format: 'mjs' }, { format: 'cjs' });

			expect(artifact.getPackageExports()).toEqual({
				'./sub': {
					node: {
						import: './mjs/sub.mjs',
						require: './cjs/sub.cjs',
					},
				},
			});
		});

		it('changes export namespace to "browser" when a `browser` platform', () => {
			artifact.platform = 'browser';
			artifact.builds.push({ format: 'lib' });

			expect(artifact.getPackageExports()).toEqual({
				'.': {
					browser: './lib/index.js',
					default: './lib/index.js',
				},
			});
		});

		it('changes export namespace to "react-native" when a `native` platform', () => {
			artifact.platform = 'native';
			artifact.builds.push({ format: 'lib' });

			expect(artifact.getPackageExports()).toEqual({
				'.': {
					'react-native': './lib/index.js',
					default: './lib/index.js',
				},
			});
		});
	});
});
