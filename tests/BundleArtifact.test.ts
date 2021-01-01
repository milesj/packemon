import fs from 'fs-extra';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import BundleArtifact from '../src/BundleArtifact';
import Project from '../src/Project';
import Package from '../src/Package';

jest.mock('fs-extra');

describe('BundleArtifact', () => {
  const fixturePath = new Path(getFixturePath('project-types'));
  const packageJson = {
    name: 'project',
    version: '0.0.0',
    packemon: {},
  };
  let artifact: BundleArtifact;

  beforeEach(() => {
    artifact = new BundleArtifact(
      new Package(new Project(fixturePath), fixturePath, { ...packageJson }),
      [],
    );
    artifact.outputName = 'index';
    artifact.inputFile = 'src/index.ts';
    artifact.startup();
  });

  it('sets correct metadata', () => {
    artifact.builds.push(
      { format: 'lib', platform: 'browser', support: 'stable' },
      { format: 'cjs', platform: 'node', support: 'legacy' },
    );

    expect(artifact.getLabel()).toBe('index');
    expect(artifact.getBuildTargets()).toEqual(['lib', 'cjs']);
    expect(artifact.toString()).toBe('bundle:index (lib, cjs)');
    expect(artifact.getStatsTitle()).toBe('project/index');
    expect(artifact.getStatsFileName()).toBe('stats-e000d9e1.html');
  });

  describe('.generateBuild()', () => {
    it('returns combination as-is when no overrides are necessary', () => {
      expect(BundleArtifact.generateBuild('lib', 'stable', ['browser'])).toEqual({
        format: 'lib',
        platform: 'browser',
        support: 'stable',
      });
    });

    it('returns `browser` platform if none provided', () => {
      expect(BundleArtifact.generateBuild('lib', 'stable', [])).toEqual({
        format: 'lib',
        platform: 'browser',
        support: 'stable',
      });
    });

    it('forces platform to `node` if format is `cjs`', () => {
      expect(BundleArtifact.generateBuild('cjs', 'current', ['browser'])).toEqual({
        format: 'cjs',
        platform: 'node',
        support: 'current',
      });
    });

    it('forces platform to `node` if format is `mjs`', () => {
      expect(BundleArtifact.generateBuild('mjs', 'experimental', ['browser'])).toEqual({
        format: 'mjs',
        platform: 'node',
        support: 'experimental',
      });
    });

    it('forces platform to `browser` if format is `esm`', () => {
      expect(BundleArtifact.generateBuild('esm', 'legacy', ['node'])).toEqual({
        format: 'esm',
        platform: 'browser',
        support: 'legacy',
      });
    });

    it('forces platform to `browser` if format is `umd`', () => {
      expect(BundleArtifact.generateBuild('umd', 'stable', ['node'])).toEqual({
        format: 'umd',
        platform: 'browser',
        support: 'stable',
      });
    });

    it('down-levels shared lib to `browser` platform if in list', () => {
      expect(
        BundleArtifact.generateBuild('lib', 'stable', ['node', 'native', 'browser'], true),
      ).toEqual({
        format: 'lib',
        platform: 'browser',
        support: 'stable',
      });
    });

    it('down-levels shared lib to `native` platform if in list', () => {
      expect(BundleArtifact.generateBuild('lib', 'stable', ['node', 'native'], true)).toEqual({
        format: 'lib',
        platform: 'native',
        support: 'stable',
      });
    });

    it('down-levels shared lib to `node` platform if in list', () => {
      expect(BundleArtifact.generateBuild('lib', 'stable', ['node'], true)).toEqual({
        format: 'lib',
        platform: 'node',
        support: 'stable',
      });
    });
  });

  describe('postBuild()', () => {
    describe('entry points', () => {
      it('adds "main" for `lib` format', () => {
        artifact.builds.push({ format: 'lib', platform: 'browser', support: 'stable' });

        expect(artifact.package.packageJson).toEqual(packageJson);

        artifact.postBuild({});

        expect(artifact.package.packageJson).toEqual({
          ...packageJson,
          main: './lib/index.js',
        });
      });

      it('adds "main" for `cjs` format', () => {
        artifact.builds.push({ format: 'cjs', platform: 'node', support: 'stable' });

        expect(artifact.package.packageJson).toEqual(packageJson);

        artifact.postBuild({});

        expect(artifact.package.packageJson).toEqual({
          ...packageJson,
          main: './cjs/index.cjs',
        });
      });

      it('adds "main" for `mjs` format', () => {
        artifact.builds.push({ format: 'mjs', platform: 'node', support: 'stable' });

        expect(artifact.package.packageJson).toEqual(packageJson);

        artifact.postBuild({});

        expect(artifact.package.packageJson).toEqual({
          ...packageJson,
          main: './mjs/index.mjs',
        });
      });

      it('adds "module" for `esm` format', () => {
        artifact.builds.push({ format: 'esm', platform: 'browser', support: 'stable' });

        expect(artifact.package.packageJson).toEqual(packageJson);

        artifact.postBuild({});

        expect(artifact.package.packageJson).toEqual({
          ...packageJson,
          module: './esm/index.js',
        });
      });

      it('adds "browser" for `umd` format', () => {
        artifact.builds.push({ format: 'umd', platform: 'browser', support: 'stable' });

        expect(artifact.package.packageJson).toEqual(packageJson);

        artifact.postBuild({});

        expect(artifact.package.packageJson).toEqual({
          ...packageJson,
          browser: './umd/index.js',
        });
      });

      describe('binary files', () => {
        beforeEach(() => {
          artifact.outputName = 'bin';
        });

        it('adds "bin" for `lib` format', () => {
          artifact.builds.push({ format: 'lib', platform: 'node', support: 'stable' });

          artifact.postBuild({});

          expect(artifact.package.packageJson).toEqual({
            ...packageJson,
            bin: './lib/bin.js',
          });
        });

        it('adds "bin" for `cjs` format', () => {
          artifact.builds.push({ format: 'cjs', platform: 'node', support: 'stable' });

          artifact.postBuild({});

          expect(artifact.package.packageJson).toEqual({
            ...packageJson,
            bin: './cjs/bin.cjs',
          });
        });

        it('adds "bin" for `mjs` format', () => {
          artifact.builds.push({ format: 'mjs', platform: 'node', support: 'stable' });

          artifact.postBuild({});

          expect(artifact.package.packageJson).toEqual({
            ...packageJson,
            bin: './mjs/bin.mjs',
          });
        });

        it('doesnt set "bin" if already defined as an object', () => {
          artifact.builds.push({ format: 'lib', platform: 'node', support: 'stable' });
          artifact.package.packageJson.bin = { example: './bin.js' };

          artifact.postBuild({});

          expect(artifact.package.packageJson).toEqual({
            ...packageJson,
            bin: { example: './bin.js' },
          });
        });
      });
    });

    describe('engines', () => {});

    describe('exports', () => {});
  });

  describe('cleanup()', () => {
    it('removes visualizer HTML files', async () => {
      await artifact.cleanup();

      expect(fs.remove).toHaveBeenCalledWith(fixturePath.append('stats-e000d9e1.html').path());
    });
  });

  describe('getInputPath()', () => {
    it('returns a `Path` to the input file', () => {
      expect(artifact.getInputPath()).toEqual(fixturePath.append('src/index.ts'));
    });

    it('errors if input file does not exist', () => {
      artifact.inputFile = 'src/missing.ts';

      expect(() => artifact.getInputPath()).toThrow(
        'Cannot find input "src/missing.ts" for package "project". Skipping package.',
      );
    });
  });

  describe('getOutputExtension()', () => {
    it('returns "js" for `lib` format', () => {
      expect(artifact.getOutputExtension('lib')).toBe('js');
    });

    it('returns "js" for `esm` format', () => {
      expect(artifact.getOutputExtension('esm')).toBe('js');
    });

    it('returns "js" for `umd` format', () => {
      expect(artifact.getOutputExtension('umd')).toBe('js');
    });

    it('returns "cjs" for `cjs` format', () => {
      expect(artifact.getOutputExtension('cjs')).toBe('cjs');
    });

    it('returns "mjs" for `mjs` format', () => {
      expect(artifact.getOutputExtension('mjs')).toBe('mjs');
    });
  });

  describe('getOutputFile()', () => {
    it('returns file path for `lib` format', () => {
      expect(artifact.getOutputFile('lib')).toBe('./lib/index.js');
    });

    it('returns file path for `esm` format', () => {
      expect(artifact.getOutputFile('esm')).toBe('./esm/index.js');
    });

    it('returns file path for `umd` format', () => {
      expect(artifact.getOutputFile('umd')).toBe('./umd/index.js');
    });

    it('returns file path for `cjs` format', () => {
      expect(artifact.getOutputFile('cjs')).toBe('./cjs/index.cjs');
    });

    it('returns file path for `mjs` format', () => {
      expect(artifact.getOutputFile('mjs')).toBe('./mjs/index.mjs');
    });
  });

  describe('getOutputDir()', () => {
    (['lib', 'esm', 'umd', 'cjs', 'mjs'] as const).forEach((format) => {
      it('returns file `Path` to output folder', () => {
        expect(artifact.getOutputDir(format)).toEqual(fixturePath.append(format));
      });
    });
  });
});
