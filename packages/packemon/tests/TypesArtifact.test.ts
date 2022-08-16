import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { Package } from '../src/Package';
import { Project } from '../src/Project';
import { TypesArtifact } from '../src/TypesArtifact';

jest.mock('fs-extra');

describe('TypesArtifact', () => {
	const fixturePath = new Path(getFixturePath('project'));
	let artifact: TypesArtifact;
	let tsconfigSpy: jest.SpyInstance;
	let warnSpy: jest.SpyInstance;

	beforeEach(() => {
		artifact = new TypesArtifact(
			new Package(new Project(fixturePath), fixturePath, {
				name: 'project',
				version: '0.0.0',
				packemon: {},
			}),
			[
				{ inputFile: 'src/index.ts', outputName: 'index' },
				{ inputFile: 'src/sub/test.ts', outputName: 'test' },
			],
		);
		artifact.startup();

		tsconfigSpy = jest
			// @ts-expect-error Allow partial return
			.spyOn(artifact, 'loadTsconfigJson')
			.mockImplementation(() => ({ options: {} } as any));

		warnSpy = jest.spyOn(console, 'warn').mockImplementation();
	});

	afterEach(() => {
		tsconfigSpy.mockRestore();
		warnSpy.mockRestore();
	});

	it('sets correct metadata', () => {
		expect(artifact.getLabel()).toBe('dts');
		expect(artifact.getBuildTargets()).toEqual(['dts']);
		expect(artifact.toString()).toBe('types (dts)');
	});

	describe('build()', () => {
		let declSpy: jest.SpyInstance;
		let declRootSpy: jest.SpyInstance;

		beforeEach(() => {
			declSpy = jest
				.spyOn(artifact, 'generateDeclarations')
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				.mockImplementation(() => Promise.resolve());

			declRootSpy = jest
				.spyOn(artifact.package.project, 'generateDeclarations')
				.mockImplementation(() => Promise.resolve());
		});

		afterEach(() => {
			declSpy.mockRestore();
			declRootSpy.mockRestore();
		});

		it('no refs, runs project `tsc` without --build', async () => {
			await artifact.build({});

			expect(declRootSpy).toHaveBeenCalled();
		});

		it('with refs, runs package `tsc` with --build', async () => {
			artifact.package.project.workspaces = ['packages/*'];

			await artifact.build({});

			expect(declSpy).toHaveBeenCalled();
		});
	});

	describe('findEntryPoint()', () => {
		it('returns mirrored source path', () => {
			expect(artifact.findEntryPoint('index')).toBe('./dts/index.d.ts');
			expect(artifact.findEntryPoint('test')).toBe('./dts/sub/test.d.ts');
		});

		it('supports .d.cts', () => {
			artifact.builds[0].inputFile = 'src/index.cts';

			expect(artifact.findEntryPoint('index')).toBe('./dts/index.d.cts');
		});

		it('supports .d.mts', () => {
			artifact.builds[0].inputFile = 'src/index.mts';

			expect(artifact.findEntryPoint('index')).toBe('./dts/index.d.mts');
		});
	});

	describe('getDeclExt()', () => {
		it('defaults to .d.ts', () => {
			expect(artifact.getDeclExt()).toBe('d.ts');
		});

		it('supports .d.cts', () => {
			artifact.builds[0].inputFile = 'src/index.cts';
			artifact.builds[1].inputFile = 'src/sub/test.cts';

			expect(artifact.getDeclExt()).toBe('d.cts');
		});

		it('supports .d.mts', () => {
			artifact.builds[0].inputFile = 'src/index.mts';
			artifact.builds[1].inputFile = 'src/sub/test.mts';

			expect(artifact.getDeclExt()).toBe('d.mts');
		});

		it('errors if multiple source formats', () => {
			artifact.builds[0].inputFile = 'src/index.cts';
			artifact.builds[1].inputFile = 'src/sub/test.mts';

			expect(() => artifact.getDeclExt()).toThrow(
				'All inputs must share the same extension. Cannot determine a TypeScript declaration format.',
			);
		});
	});

	describe('getPackageExports()', () => {
		it('adds exports based on input file and output name builds', () => {
			expect(artifact.getPackageExports()).toEqual({
				'.': {
					types: './dts/index.d.ts',
				},
				'./test': {
					types: './dts/sub/test.d.ts',
				},
			});
		});

		it('supports .d.cts', () => {
			artifact.builds[0].inputFile = 'src/index.cts';
			artifact.builds[1].inputFile = 'src/sub/test.cts';

			expect(artifact.getPackageExports()).toEqual({
				'.': {
					types: './dts/index.d.cts',
				},
				'./test': {
					types: './dts/sub/test.d.cts',
				},
			});
		});

		it('supports .d.mts', () => {
			artifact.builds[0].inputFile = 'src/index.mts';
			artifact.builds[1].inputFile = 'src/sub/test.mts';

			expect(artifact.getPackageExports()).toEqual({
				'.': {
					types: './dts/index.d.mts',
				},
				'./test': {
					types: './dts/sub/test.d.mts',
				},
			});
		});
	});
});
