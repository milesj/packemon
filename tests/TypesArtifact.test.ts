import fs from 'fs-extra';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { Extractor } from '@microsoft/api-extractor';
import { Package } from '../src/Package';
import { Project } from '../src/Project';
import { TypesArtifact } from '../src/TypesArtifact';
import { delay, mockSpy } from './helpers';

jest.mock('fs-extra');
jest.mock('@microsoft/api-extractor');

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

  describe('cleanup()', () => {
    it('deletes API config files for each build', async () => {
      await artifact.cleanup();

      expect(fs.remove).toHaveBeenCalledWith(fixturePath.append('api-extractor-index.json').path());
      expect(fs.remove).toHaveBeenCalledWith(fixturePath.append('api-extractor-test.json').path());
    });
  });

  describe('build()', () => {
    let declSpy: jest.SpyInstance;
    let apiSpy: jest.SpyInstance;

    beforeEach(() => {
      declSpy = jest
        .spyOn(artifact.package.project, 'generateDeclarations')
        .mockImplementation(() => Promise.resolve());

      // @ts-expect-error Allow access
      apiSpy = jest.spyOn(artifact, 'generateApiDeclaration');

      mockSpy(Extractor.invoke).mockImplementation(() => ({ succeeded: true }));
    });

    afterEach(() => {
      declSpy.mockRestore();
      apiSpy.mockRestore();
    });

    describe('standard types', () => {
      it('generates types using `tsc`', async () => {
        await artifact.build({});

        expect(declSpy).toHaveBeenCalled();
        expect(apiSpy).not.toHaveBeenCalled();
      });

      it('runs the same `tsc` when using workspaces', async () => {
        artifact.package.project.workspaces = ['packages/*'];

        await artifact.build({});

        expect(declSpy).toHaveBeenCalled();
        expect(apiSpy).not.toHaveBeenCalled();
      });
    });

    describe('api types', () => {
      beforeEach(() => {
        artifact.declarationType = 'api';
      });

      it('generates a single file using api extractor', async () => {
        await artifact.build({});

        expect(declSpy).toHaveBeenCalled();
        expect(apiSpy).toHaveBeenCalledWith('index', 'src/index.ts', fixturePath.append('dts'));
        expect(apiSpy).toHaveBeenCalledWith('test', 'src/sub/test.ts', fixturePath.append('dts'));
        expect(Extractor.invoke).toHaveBeenCalledTimes(2);
      });

      it('logs a warning if dts file does not exist', async () => {
        artifact.builds.push({
          inputFile: 'src/missing.ts',
          outputName: 'missing',
        });

        await artifact.build({});

        expect(warnSpy).toHaveBeenCalledWith(
          `Unable to generate declaration for "missing". Declaration entry point "${fixturePath
            .append('dts/missing.d.ts')
            .path()}" does not exist.`,
        );
        expect(fs.writeJson).not.toHaveBeenCalledWith(
          fixturePath.append('api-extractor-missing.json').path(),
          expect.any(Object),
        );
        expect(Extractor.invoke).not.toHaveBeenCalledTimes(3);
      });

      it('creates api extractor config files for each output', async () => {
        await artifact.build({});

        expect(fs.writeJson).toHaveBeenCalledWith(
          fixturePath.append('api-extractor-index.json').path(),
          expect.objectContaining({
            projectFolder: artifact.package.path.path(),
            mainEntryPointFilePath: fixturePath.append('dts/index.d.ts').path(),
            dtsRollup: expect.objectContaining({
              untrimmedFilePath: '<projectFolder>/dts/index.d.ts',
            }),
          }),
        );
        expect(fs.writeJson).toHaveBeenCalledWith(
          fixturePath.append('api-extractor-test.json').path(),
          expect.objectContaining({
            projectFolder: artifact.package.path.path(),
            mainEntryPointFilePath: fixturePath.append('dts/sub/test.d.ts').path(),
            dtsRollup: expect.objectContaining({
              untrimmedFilePath: '<projectFolder>/dts/test.d.ts',
            }),
          }),
        );
      });

      it('removes generated declarations that arent the output files', async () => {
        await artifact.build({});

        // Remove happens in the background so we must wait manually
        await delay(100);

        expect(fs.remove).not.toHaveBeenCalledWith(fixturePath.append('dts/index.d.ts').path());
        expect(fs.remove).toHaveBeenCalledWith(fixturePath.append('dts/extra.d.ts').path());
        expect(fs.remove).not.toHaveBeenCalledWith(fixturePath.append('dts/test.d.ts').path());
      });

      it('logs an error if extractor fails', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation();

        mockSpy(Extractor.invoke).mockImplementation(() => ({
          succeeded: false,
          errorCount: 1,
          warningCount: 3,
        }));

        await artifact.build({});

        expect(spy).toHaveBeenCalledWith(
          'Generated "index" types completed with 1 errors and 3 warnings!',
        );
        spy.mockRestore();
      });

      describe('workspaces', () => {
        beforeEach(() => {
          artifact.package.project.workspaces = ['packages/*'];
        });

        it('uses `declarationDir` from compiler options', async () => {
          tsconfigSpy.mockImplementation(
            () =>
              ({
                options: {
                  declarationDir: 'declarationDir',
                  outDir: 'outDir',
                },
              } as any),
          );

          await artifact.build({});

          expect(apiSpy).toHaveBeenCalledWith('index', 'src/index.ts', new Path('declarationDir'));
          expect(apiSpy).toHaveBeenCalledWith(
            'test',
            'src/sub/test.ts',
            new Path('declarationDir'),
          );
        });

        it('uses `outDir` from compiler options if `declarationDir` is not defined', async () => {
          tsconfigSpy.mockImplementation(
            () =>
              ({
                options: {
                  outDir: 'outDir',
                },
              } as any),
          );

          await artifact.build({});

          expect(apiSpy).toHaveBeenCalledWith('index', 'src/index.ts', new Path('outDir'));
          expect(apiSpy).toHaveBeenCalledWith('test', 'src/sub/test.ts', new Path('outDir'));
        });

        it('uses hard-coded dts folder if neither compiler option is defined', async () => {
          await artifact.build({});

          expect(apiSpy).toHaveBeenCalledWith('index', 'src/index.ts', fixturePath.append('dts'));
          expect(apiSpy).toHaveBeenCalledWith('test', 'src/sub/test.ts', fixturePath.append('dts'));
        });
      });
    });
  });

  describe('findEntryPoint()', () => {
    describe('standard types', () => {
      it('returns mirrored source path', () => {
        artifact.declarationType = 'standard';

        expect(artifact.findEntryPoint('index')).toBe('./dts/index.d.ts');
        expect(artifact.findEntryPoint('test')).toBe('./dts/sub/test.d.ts');
      });
    });

    describe('api types', () => {
      it('returns top level output file', () => {
        artifact.declarationType = 'api';

        expect(artifact.findEntryPoint('index')).toBe('./dts/index.d.ts');
        expect(artifact.findEntryPoint('test')).toBe('./dts/test.d.ts');
      });
    });
  });

  describe('getPackageExports()', () => {
    it('adds exports based on input file and output name builds', () => {
      expect(artifact.getPackageExports()).toEqual({
        './index': {
          types: './dts/index.d.ts',
        },
        './test': {
          types: './dts/sub/test.d.ts',
        },
      });
    });
  });
});
