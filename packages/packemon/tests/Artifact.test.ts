import execa from 'execa';
import fsx from 'fs-extra';
import { rollup } from 'rollup';
import { applyStyle } from '@boost/cli';
import { Path } from '@boost/common';
import { Artifact } from '../src/Artifact';
import { getRollupConfig } from '../src/rollup/config';
import { getFixturePath, loadPackageAtPath, mockSpy } from './helpers';

jest.mock('../src/rollup/config', () => ({
	getRollupConfig: jest.fn(() => ({
		input: true,
		output: [
			{ originalFormat: 'lib', a: true },
			{ originalFormat: 'cjs', b: true },
			{ originalFormat: 'mjs', c: true },
		],
	})),
}));

jest.mock('execa');

jest.mock('rimraf', () =>
	jest.fn((path, cb) => {
		cb();
	}),
);

jest.mock('rollup', () => ({ rollup: jest.fn() }));

class TestArtifact extends Artifact {
	log = this.logWithSource.bind(this);
}

describe('Artifact', () => {
	const fixturePath = new Path(getFixturePath('project'));
	let artifact: TestArtifact;

	beforeEach(() => {
		artifact = new TestArtifact(loadPackageAtPath(fixturePath), [
			{ format: 'cjs' },
			{ format: 'mjs' },
		]);
		artifact.inputs = { index: 'src/index.ts' };
	});

	it('returns label when cast to string', () => {
		expect(String(artifact)).toBe('node:stable:cjs,mjs');
	});

	describe('build()', () => {
		it('builds code and types', async () => {
			const codeSpy = jest.spyOn(artifact, 'buildCode').mockImplementation();
			const typesSpy = jest.spyOn(artifact, 'buildTypes').mockImplementation();

			await artifact.build({}, {}, {});

			expect(codeSpy).toHaveBeenCalled();
			expect(typesSpy).toHaveBeenCalled();
		});
	});

	describe('buildCode()', () => {
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

			artifact.builds.push({ format: 'lib' });
		});

		it('generates rollup config using input config', async () => {
			await artifact.buildCode({ typescript: true }, {});

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

		it('writes a bundle and stats for each build', async () => {
			await artifact.buildCode({}, {});

			expect(bundleWriteSpy).toHaveBeenCalledWith({ a: true });
			expect(artifact.builds[0].stats?.size).toBe(4);

			expect(bundleWriteSpy).toHaveBeenCalledWith({ b: true });
			expect(artifact.builds[1].stats?.size).toBe(4);

			expect(bundleWriteSpy).toHaveBeenCalledWith({ c: true });
			expect(artifact.builds[2].stats?.size).toBe(4);
		});
	});

	describe('buildTypes()', () => {
		it('doesnt run if typescript is disabled', async () => {
			await artifact.buildTypes({ typescript: false });

			expect(execa).not.toHaveBeenCalled();
		});

		it('doesnt run if a specific build has declarations disabled', async () => {
			artifact.builds[0].declaration = true;

			await artifact.buildTypes({ typescript: true });

			expect(execa).toHaveBeenCalledTimes(1);
		});

		it('runs `tsc` for each build', async () => {
			artifact.builds[0].declaration = true;
			artifact.builds[1].declaration = true;

			await artifact.buildTypes({ typescript: true });

			expect(execa).toHaveBeenCalledWith(
				'tsc',
				[
					'--declaration',
					'--declarationDir',
					'cjs',
					'--declarationMap',
					'--emitDeclarationOnly',
					'--project',
					'tsconfig.cjs.json',
				],
				{ cwd: fixturePath.path(), preferLocal: true },
			);

			expect(execa).toHaveBeenCalledWith(
				'tsc',
				[
					'--declaration',
					'--declarationDir',
					'mjs',
					'--declarationMap',
					'--emitDeclarationOnly',
					'--project',
					'tsconfig.mjs.json',
				],
				{ cwd: fixturePath.path(), preferLocal: true },
			);
		});

		it('runs `tsc` for each build in composite mode', async () => {
			artifact.builds[0].declaration = true;
			artifact.builds[1].declaration = true;

			await artifact.buildTypes({ typescript: true, typescriptComposite: true });

			expect(execa).toHaveBeenCalledWith('tsc', ['--build', '--force', 'tsconfig.cjs.json'], {
				cwd: fixturePath.path(),
				preferLocal: true,
			});

			expect(execa).toHaveBeenCalledWith('tsc', ['--build', '--force', 'tsconfig.mjs.json'], {
				cwd: fixturePath.path(),
				preferLocal: true,
			});
		});
	});

	describe('clean()', () => {
		it('removes the dir for each format', async () => {
			const spy = jest.spyOn(fsx, 'remove');

			await artifact.clean();

			expect(spy).toHaveBeenCalledWith(fixturePath.append('assets').path());
			expect(spy).toHaveBeenCalledWith(fixturePath.append('dts').path());
			expect(spy).toHaveBeenCalledWith(fixturePath.append('cjs').path());
			expect(spy).toHaveBeenCalledWith(fixturePath.append('mjs').path());
		});
	});

	describe('getBuildOutput()', () => {
		beforeEach(() => {
			artifact.platform = 'node';
		});

		it('returns metadata for `lib` format', () => {
			expect(artifact.getBuildOutput('lib', 'index')).toEqual({
				declExt: undefined,
				declPath: undefined,
				entryExt: 'js',
				entryPath: './lib/index.js',
				folder: 'lib',
			});
		});

		it('returns metadata for `esm` format', () => {
			expect(artifact.getBuildOutput('esm', 'index')).toEqual({
				declExt: undefined,
				declPath: undefined,
				entryExt: 'js',
				entryPath: './esm/index.js',
				folder: 'esm',
			});
		});

		it('returns metadata for `umd` format', () => {
			expect(artifact.getBuildOutput('umd', 'index')).toEqual({
				declExt: undefined,
				declPath: undefined,
				entryExt: 'js',
				entryPath: './umd/index.js',
				folder: 'umd',
			});
		});

		it('returns metadata for `cjs` format', () => {
			expect(artifact.getBuildOutput('cjs', 'index')).toEqual({
				declExt: undefined,
				declPath: undefined,
				entryExt: 'cjs',
				entryPath: './cjs/index.cjs',
				folder: 'cjs',
			});
		});

		it('returns metadata for `mjs` format', () => {
			expect(artifact.getBuildOutput('mjs', 'index')).toEqual({
				declExt: undefined,
				declPath: undefined,
				entryExt: 'mjs',
				entryPath: './mjs/index.mjs',
				folder: 'mjs',
			});
		});

		describe('shared lib', () => {
			it('includes platform in folder when shared lib required', () => {
				artifact.sharedLib = true;

				expect(artifact.getBuildOutput('lib', 'index')).toEqual({
					declExt: undefined,
					declPath: undefined,
					entryExt: 'js',
					entryPath: './lib/node/index.js',
					folder: 'lib/node',
				});
			});

			it('ignores shared lib if not `lib` format', () => {
				artifact.sharedLib = true;

				expect(artifact.getBuildOutput('esm', 'index')).toEqual({
					declExt: undefined,
					declPath: undefined,
					entryExt: 'js',
					entryPath: './esm/index.js',
					folder: 'esm',
				});
			});
		});

		it('public api: uses original source file path', () => {
			artifact.api = 'public';
			artifact.inputs = { index: 'src/some/other/file.ts' };

			expect(artifact.getBuildOutput('mjs', 'index')).toEqual({
				declExt: undefined,
				declPath: undefined,
				entryExt: 'mjs',
				entryPath: './mjs/some/other/file.mjs',
				folder: 'mjs',
			});
		});

		describe('types', () => {
			it('returns declaration fields', () => {
				expect(artifact.getBuildOutput('lib', 'index', true)).toEqual({
					declExt: 'd.ts',
					declPath: './lib/index.d.ts',
					entryExt: 'js',
					entryPath: './lib/index.js',
					folder: 'lib',
				});
			});

			it('supports cts', () => {
				artifact.inputs = { index: 'src/index.cts' };
				artifact.builds = [{ format: 'cjs' }];

				expect(artifact.getBuildOutput('cjs', 'index', true)).toEqual({
					declExt: 'd.cts',
					declPath: './cjs/index.d.cts',
					entryExt: 'cjs',
					entryPath: './cjs/index.cjs',
					folder: 'cjs',
				});
			});

			it('supports mts', () => {
				artifact.inputs = { index: 'src/index.mts' };
				artifact.builds = [{ format: 'mjs' }];

				expect(artifact.getBuildOutput('mjs', 'index', true)).toEqual({
					declExt: 'd.mts',
					declPath: './mjs/index.d.mts',
					entryExt: 'mjs',
					entryPath: './mjs/index.mjs',
					folder: 'mjs',
				});
			});
		});
	});

	describe('getInputPaths()', () => {
		it('returns an absolute path for every input', () => {
			expect(artifact.getInputPaths()).toEqual({
				index: fixturePath.append('src/index.ts').path(),
			});
		});
	});

	describe('getPackageExports()', () => {
		beforeEach(() => {
			artifact.builds = [];
		});

		it('adds exports based on input file and output name', () => {
			artifact.builds.push({ format: 'lib' });

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					node: {
						types: undefined,
						default: './lib/index.js',
					},
					default: './lib/index.js',
				},
			});
		});

		it('adds exports based on input file and output name when shared lib required', () => {
			artifact.sharedLib = true;
			artifact.builds.push({ format: 'lib' });

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					node: {
						types: undefined,
						default: './lib/node/index.js',
					},
					default: './lib/node/index.js',
				},
			});
		});

		it('supports subpath file exports when output name is not "index"', () => {
			artifact.inputs = { sub: './src/sub.ts' };
			artifact.builds.push({ format: 'lib' });

			expect(artifact.getPackageExports({})).toEqual({
				'./sub': {
					node: {
						types: undefined,
						default: './lib/sub.js',
					},
					default: './lib/sub.js',
				},
			});
		});

		it('supports conditional exports when there are multiple builds', () => {
			artifact.builds.push({ format: 'lib' }, { format: 'mjs' }, { format: 'cjs' });

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					node: {
						import: {
							types: undefined,
							default: './mjs/index.mjs',
						},
						require: {
							types: undefined,
							default: './cjs/index.cjs',
						},
					},
					default: './lib/index.js',
				},
			});
		});

		it('supports conditional exports with types when there are multiple builds', () => {
			artifact.builds.push(
				{ declaration: true, format: 'lib' },
				{ declaration: true, format: 'mjs' },
				{ declaration: true, format: 'cjs' },
			);

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					types: './lib/index.d.ts',
					node: {
						import: {
							types: './mjs/index.d.ts',
							default: './mjs/index.mjs',
						},
						require: {
							types: './cjs/index.d.ts',
							default: './cjs/index.cjs',
						},
					},
					default: './lib/index.js',
				},
			});
		});

		it('skips `default` export when there is no `lib` build', () => {
			artifact.inputs = { sub: './src/sub.ts' };
			artifact.builds.push({ format: 'mjs' }, { format: 'cjs' });

			expect(artifact.getPackageExports({})).toEqual({
				'./sub': {
					node: {
						import: {
							types: undefined,
							default: './mjs/sub.mjs',
						},
						require: {
							types: undefined,
							default: './cjs/sub.cjs',
						},
					},
				},
			});
		});

		it('changes export namespace to "browser" when a `browser` platform', () => {
			artifact.platform = 'browser';
			artifact.builds.push({ format: 'lib' });

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					browser: {
						types: undefined,
						default: './lib/index.js',
					},
					default: './lib/index.js',
				},
			});
		});

		it('changes export namespace to "react-native" when a `native` platform', () => {
			artifact.platform = 'native';
			artifact.builds.push({ format: 'lib' });

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					'react-native': {
						default: './lib/index.js',
					},
					default: './lib/index.js',
				},
			});
		});

		it('supports lib', () => {
			artifact.builds.push({ format: 'lib' });

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					node: {
						types: undefined,
						default: './lib/index.js',
					},
					default: './lib/index.js',
				},
			});
		});

		it('supports lib with types', () => {
			artifact.builds.push({ declaration: true, format: 'lib' });

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					types: './lib/index.d.ts',
					node: {
						types: './lib/index.d.ts',
						default: './lib/index.js',
					},
					default: './lib/index.js',
				},
			});
		});

		it('supports cjs', () => {
			artifact.builds.push({ format: 'cjs' });

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					node: {
						import: './cjs/index-wrapper.mjs',
						require: './cjs/index.cjs',
					},
				},
			});
		});

		it('supports cjs with types', () => {
			artifact.builds.push({ declaration: true, format: 'cjs' });

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					node: {
						types: './cjs/index.d.ts',
						import: './cjs/index-wrapper.mjs',
						require: './cjs/index.cjs',
					},
				},
			});
		});

		it('supports .d.cts', () => {
			artifact.builds.push({ declaration: true, format: 'cjs' });
			artifact.inputs = { index: 'src/index.cts' };

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					node: {
						types: './cjs/index.d.cts',
						import: './cjs/index-wrapper.mjs',
						require: './cjs/index.cjs',
					},
				},
			});
		});

		it('supports mjs', () => {
			artifact.builds.push({ format: 'mjs' });

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					node: {
						import: './mjs/index.mjs',
					},
				},
			});
		});

		it('supports mjs with types', () => {
			artifact.builds.push({ declaration: true, format: 'mjs' });

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					node: {
						types: './mjs/index.d.ts',
						import: './mjs/index.mjs',
					},
				},
			});
		});

		it('supports .d.mts', () => {
			artifact.builds.push({ declaration: true, format: 'mjs' });
			artifact.inputs = { index: 'src/index.mts' };

			expect(artifact.getPackageExports({})).toEqual({
				'.': {
					node: {
						types: './mjs/index.d.mts',
						import: './mjs/index.mjs',
					},
				},
			});
		});

		describe('solid', () => {
			it('adds entry point to source code', () => {
				artifact.builds.push({ format: 'lib' });

				expect(artifact.getPackageExports({ solid: true })).toEqual({
					'.': {
						node: {
							types: undefined,
							default: './lib/index.js',
						},
						solid: './src/index.ts',
						default: './lib/index.js',
					},
				});
			});

			it('supports non-bundle', () => {
				artifact.api = 'public';
				artifact.bundle = false;
				artifact.builds.push({ format: 'lib' });

				expect(artifact.getPackageExports({ solid: true })).toEqual({
					'.': {
						node: {
							types: undefined,
							default: './lib/index.js',
						},
						solid: './src/index.ts',
						default: './lib/index.js',
					},
					'./*': {
						node: {
							types: undefined,
							default: './lib/*.js',
						},
						solid: './src/*.js',
						default: './lib/*.js',
					},
				});
			});

			it('supports shared lib', () => {
				artifact.sharedLib = true;
				artifact.builds.push({ format: 'lib' });

				expect(artifact.getPackageExports({ solid: true })).toEqual({
					'.': {
						node: {
							types: undefined,
							default: './lib/node/index.js',
						},
						solid: './src/index.ts',
						default: './lib/node/index.js',
					},
				});
			});

			it('supports types', () => {
				artifact.platform = 'browser';
				artifact.builds.push({ declaration: true, format: 'esm' });

				expect(artifact.getPackageExports({ solid: true })).toEqual({
					'.': {
						browser: {
							default: undefined,
							import: './esm/index.js',
							module: './esm/index.js',
							types: './esm/index.d.ts',
						},
						solid: './src/index.ts',
					},
				});
			});
		});
	});

	describe('logWithSource()', () => {
		it('logs a message to level', () => {
			const spy = jest.spyOn(console, 'info').mockImplementation();

			artifact.log('Hello', 'info');

			expect(spy).toHaveBeenCalledWith('[project] Hello');

			spy.mockRestore();
		});

		it('includes output name and ID', () => {
			const spy = jest.spyOn(console, 'error').mockImplementation();

			artifact.log('Hello', 'error', { id: 'id', output: 'index' });

			expect(spy).toHaveBeenCalledWith(`[project:index] Hello${applyStyle(' (id=id)', 'muted')}`);

			spy.mockRestore();
		});

		it('includes source information', () => {
			const spy = jest.spyOn(console, 'warn').mockImplementation();

			artifact.log('Hello', 'warn', {
				sourceFile: fixturePath.append('test.js').path(),
				sourceLine: 10,
				sourceColumn: 55,
			});

			expect(spy).toHaveBeenCalledWith(
				`[project] Hello${applyStyle(' (file=test.js line=10:55)', 'muted')}`,
			);

			spy.mockRestore();
		});

		it('includes source line without column', () => {
			const spy = jest.spyOn(console, 'warn').mockImplementation();

			artifact.log('Hello', 'warn', {
				sourceLine: 10,
			});

			expect(spy).toHaveBeenCalledWith(`[project] Hello${applyStyle(' (line=10:?)', 'muted')}`);

			spy.mockRestore();
		});

		it('includes source column without line', () => {
			const spy = jest.spyOn(console, 'info').mockImplementation();

			artifact.log('Hello', 'info', {
				sourceColumn: 55,
			});

			expect(spy).toHaveBeenCalledWith(`[project] Hello${applyStyle(' (line=?:55)', 'muted')}`);

			spy.mockRestore();
		});
	});
});
