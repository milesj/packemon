import execa from 'execa';
import fsx from 'fs-extra';
import { applyStyle } from '@boost/cli';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { Artifact } from '../src/Artifact';
import { loadPackageAtPath } from './helpers';

jest.mock('execa');

jest.mock('rimraf', () =>
	jest.fn((path, cb) => {
		cb();
	}),
);

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

			expect(execa).toHaveBeenCalledWith('tsc', ['--build', 'tsconfig.cjs.json'], {
				cwd: fixturePath.path(),
				preferLocal: true,
			});

			expect(execa).toHaveBeenCalledWith('tsc', ['--build', 'tsconfig.mjs.json'], {
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
				ext: 'js',
				extGroup: 'js,map',
				file: 'index.js',
				folder: 'lib',
				path: './lib/index.js',
			});
		});

		it('returns metadata for `esm` format', () => {
			expect(artifact.getBuildOutput('esm', 'index')).toEqual({
				ext: 'js',
				extGroup: 'js,map',
				file: 'index.js',
				folder: 'esm',
				path: './esm/index.js',
			});
		});

		it('returns metadata for `umd` format', () => {
			expect(artifact.getBuildOutput('umd', 'index')).toEqual({
				ext: 'js',
				extGroup: 'js,map',
				file: 'index.js',
				folder: 'umd',
				path: './umd/index.js',
			});
		});

		it('returns metadata for `cjs` format', () => {
			expect(artifact.getBuildOutput('cjs', 'index')).toEqual({
				ext: 'cjs',
				extGroup: 'cjs,mjs,map',
				file: 'index.cjs',
				folder: 'cjs',
				path: './cjs/index.cjs',
			});
		});

		it('returns metadata for `mjs` format', () => {
			expect(artifact.getBuildOutput('mjs', 'index')).toEqual({
				ext: 'mjs',
				extGroup: 'mjs,map',
				file: 'index.mjs',
				folder: 'mjs',
				path: './mjs/index.mjs',
			});
		});

		describe('shared lib', () => {
			it('includes platform in folder when shared lib required', () => {
				artifact.sharedLib = true;

				expect(artifact.getBuildOutput('lib', 'index')).toEqual({
					ext: 'js',
					extGroup: 'js,map',
					file: 'index.js',
					folder: 'lib/node',
					path: './lib/node/index.js',
				});
			});

			it('ignores shared lib if not `lib` format', () => {
				artifact.sharedLib = true;

				expect(artifact.getBuildOutput('esm', 'index')).toEqual({
					ext: 'js',
					extGroup: 'js,map',
					file: 'index.js',
					folder: 'esm',
					path: './esm/index.js',
				});
			});
		});

		it('public api: uses original source file path', () => {
			artifact.api = 'public';
			artifact.inputs = { index: 'src/some/other/file.ts' };

			expect(artifact.getBuildOutput('mjs', 'index')).toEqual({
				ext: 'mjs',
				extGroup: 'mjs,map',
				file: 'some/other/file.mjs',
				folder: 'mjs',
				path: './mjs/some/other/file.mjs',
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
