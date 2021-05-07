import fs from 'fs-extra';
import { rollup } from 'rollup';
import { transformFileAsync } from '@babel/core';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { getBabelInputConfig, getBabelOutputConfig } from '../src/babel/config';
import { BundleArtifact } from '../src/BundleArtifact';
import { Package } from '../src/Package';
import { Project } from '../src/Project';
import { getRollupConfig } from '../src/rollup/config';
import { mockSpy } from './helpers';

jest.mock('../src/babel/config', () => ({
  getBabelInputConfig: jest.fn(() => ({
    input: true,
    plugins: [],
    presets: [],
  })),
  getBabelOutputConfig: jest.fn(() => ({
    output: true,
    plugins: [],
    presets: [],
  })),
}));

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

jest.mock('@babel/core');
jest.mock('fs-extra');
jest.mock('rollup');

describe('BundleArtifact', () => {
  const fixturePath = new Path(getFixturePath('project'));
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

    mockSpy(fs.writeFile).mockReset();
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
    expect(artifact.getStatsFileName()).toBe('stats-project-index.html');
  });

  describe('build()', () => {
    beforeEach(() => {
      jest
        .spyOn(artifact.package, 'getFeatureFlags')
        .mockImplementation(() => ({ typescript: true }));

      artifact.builds.push(
        { format: 'lib', platform: 'browser', support: 'stable' },
        { format: 'cjs', platform: 'node', support: 'legacy' },
        { format: 'esm', platform: 'browser', support: 'current' },
      );
    });

    describe('babel', () => {
      const babelConfig = {
        input: true,
        plugins: [],
        presets: [],
      };

      beforeEach(() => {
        artifact.bundle = false;

        mockSpy(transformFileAsync).mockImplementation(() => ({ code: 'code' }));
      });

      it('generates babel config using input config', async () => {
        await artifact.build({});

        expect(getBabelInputConfig).toHaveBeenCalledWith(artifact, { typescript: true });
        expect(getBabelOutputConfig).toHaveBeenCalledWith(artifact.builds[0], { typescript: true });
        expect(getBabelOutputConfig).toHaveBeenCalledWith(artifact.builds[1], { typescript: true });
        expect(getBabelOutputConfig).toHaveBeenCalledWith(artifact.builds[2], { typescript: true });
        expect(transformFileAsync).toHaveBeenCalledWith(expect.any(String), babelConfig);
      });

      it('inherits `analyze` feature flag', async () => {
        await artifact.build({ analyze: 'network' });

        expect(getBabelInputConfig).toHaveBeenCalledWith(artifact, {
          analyze: 'network',
          typescript: true,
        });
      });

      it('writes a file for every source file', async () => {
        await artifact.build({});

        expect(fs.writeFile).toHaveBeenCalledWith(
          expect.stringContaining('lib/index.js'),
          'code',
          'utf8',
        );
        expect(transformFileAsync).toHaveBeenCalledWith(
          expect.stringContaining('src/index.ts'),
          babelConfig,
        );
        expect(artifact.builds[0].stats?.size).toBe(8);

        expect(fs.writeFile).toHaveBeenCalledWith(
          expect.stringContaining('cjs/index.cjs'),
          'code',
          'utf8',
        );
        expect(transformFileAsync).toHaveBeenCalledWith(
          expect.stringContaining('src/index.ts'),
          babelConfig,
        );
        expect(artifact.builds[1].stats?.size).toBe(8);

        expect(fs.writeFile).toHaveBeenCalledWith(
          expect.stringContaining('esm/index.js'),
          'code',
          'utf8',
        );
        expect(transformFileAsync).toHaveBeenCalledWith(
          expect.stringContaining('src/index.ts'),
          babelConfig,
        );
        expect(artifact.builds[2].stats?.size).toBe(8);
      });

      it('writes a source map for every file', async () => {
        mockSpy(transformFileAsync).mockImplementation((file) => ({
          code: 'code',
          map: { sources: [file] },
        }));

        await artifact.build({});

        expect(fs.writeFile).toHaveBeenCalledWith(
          expect.stringMatching(/lib\/sub\/test\.js\.map$/),
          JSON.stringify({
            sources: ['../../src/sub/test.ts'],
            file: 'test.js',
            sourcesContent: null,
          }),
          'utf8',
        );

        expect(fs.writeFile).toHaveBeenCalledWith(
          expect.stringMatching(/lib\/sub\/test\.js$/),
          'code\n//# sourceMappingURL=test.js.map',
          'utf8',
        );
      });

      it('writes a file with the correct extension based on format', async () => {
        artifact.builds.push({ format: 'mjs', platform: 'node', support: 'experimental' });

        await artifact.build({});

        expect(fs.writeFile).toHaveBeenCalledWith(
          expect.stringContaining('lib/index.js'),
          'code',
          'utf8',
        );

        expect(fs.writeFile).toHaveBeenCalledWith(
          expect.stringContaining('cjs/index.cjs'),
          'code',
          'utf8',
        );

        expect(fs.writeFile).toHaveBeenCalledWith(
          expect.stringContaining('esm/index.js'),
          'code',
          'utf8',
        );

        expect(fs.writeFile).toHaveBeenCalledWith(
          expect.stringContaining('mjs/index.mjs'),
          'code',
          'utf8',
        );
      });
    });

    describe('rollup', () => {
      let bundleWriteSpy: jest.SpyInstance;

      beforeEach(() => {
        artifact.bundle = true;

        bundleWriteSpy = jest.fn(() => ({ output: [{ code: 'code' }] }));

        mockSpy(rollup)
          .mockReset()
          .mockImplementation(() => ({
            cache: { cache: true },
            write: bundleWriteSpy,
          }));
      });

      it('generates rollup config using input config', async () => {
        await artifact.build({});

        expect(getRollupConfig).toHaveBeenCalledWith(artifact, { typescript: true });
        expect(rollup).toHaveBeenCalledWith({
          input: true,
          onwarn: expect.any(Function),
        });
      });

      it('inherits `analyze` feature flag', async () => {
        await artifact.build({ analyze: 'network' });

        expect(getRollupConfig).toHaveBeenCalledWith(artifact, {
          analyze: 'network',
          typescript: true,
        });
      });

      it('sets rollup cache on artifact', async () => {
        expect(artifact.cache).toBeUndefined();

        await artifact.build({});

        expect(artifact.cache).toEqual({ cache: true });
      });

      it('writes a bundle and stats for each build', async () => {
        await artifact.build({});

        expect(bundleWriteSpy).toHaveBeenCalledWith({ a: true });
        expect(artifact.builds[0].stats?.size).toBe(4);

        expect(bundleWriteSpy).toHaveBeenCalledWith({ b: true });
        expect(artifact.builds[1].stats?.size).toBe(4);

        expect(bundleWriteSpy).toHaveBeenCalledWith({ c: true });
        expect(artifact.builds[2].stats?.size).toBe(4);
      });
    });

    describe('engines', () => {
      it('does nothing if builds is not `node`', async () => {
        artifact.platform = 'browser';
        artifact.builds.push({ format: 'lib', platform: 'browser', support: 'stable' });

        expect(artifact.package.packageJson.engines).toBeUndefined();

        await artifact.build({ addEngines: true });

        expect(artifact.package.packageJson.engines).toBeUndefined();
      });

      it('does nothing if `addEngines` is false', async () => {
        artifact.builds.push({ format: 'lib', platform: 'node', support: 'stable' });

        expect(artifact.package.packageJson.engines).toBeUndefined();

        await artifact.build({ addEngines: false });

        expect(artifact.package.packageJson.engines).toBeUndefined();
      });

      it('adds npm and node engines for `node` build', async () => {
        artifact.builds.push({ format: 'lib', platform: 'node', support: 'stable' });

        expect(artifact.package.packageJson.engines).toBeUndefined();

        await artifact.build({ addEngines: true });

        expect(artifact.package.packageJson.engines).toEqual({ node: '>=10.3.0', npm: '>=6.1.0' });
      });

      it('merges with existing engines', async () => {
        artifact.builds.push({ format: 'lib', platform: 'node', support: 'stable' });

        artifact.package.packageJson.engines = {
          packemon: '*',
        };

        expect(artifact.package.packageJson.engines).toEqual({ packemon: '*' });

        await artifact.build({ addEngines: true });

        expect(artifact.package.packageJson.engines).toEqual({
          packemon: '*',
          node: '>=10.3.0',
          npm: '>=6.1.0',
        });
      });
    });
  });

  describe('cleanup()', () => {
    it('removes visualizer HTML files', async () => {
      await artifact.cleanup();

      expect(fs.remove).toHaveBeenCalledWith(fixturePath.append('stats-project-index.html').path());
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

  describe('getOutputMetadata()', () => {
    beforeEach(() => {
      artifact.platform = 'node';
    });

    it('returns metadata for `lib` format', () => {
      expect(artifact.getOutputMetadata('lib')).toEqual({
        ext: 'js',
        file: 'index.js',
        folder: 'lib',
        path: './lib/index.js',
      });
    });

    it('returns metadata for `esm` format', () => {
      expect(artifact.getOutputMetadata('esm')).toEqual({
        ext: 'js',
        file: 'index.js',
        folder: 'esm',
        path: './esm/index.js',
      });
    });

    it('returns metadata for `umd` format', () => {
      expect(artifact.getOutputMetadata('umd')).toEqual({
        ext: 'js',
        file: 'index.js',
        folder: 'umd',
        path: './umd/index.js',
      });
    });

    it('returns metadata for `cjs` format', () => {
      expect(artifact.getOutputMetadata('cjs')).toEqual({
        ext: 'cjs',
        file: 'index.cjs',
        folder: 'cjs',
        path: './cjs/index.cjs',
      });
    });

    it('returns metadata for `mjs` format', () => {
      expect(artifact.getOutputMetadata('mjs')).toEqual({
        ext: 'mjs',
        file: 'index.mjs',
        folder: 'mjs',
        path: './mjs/index.mjs',
      });
    });

    describe('shared lib', () => {
      it('includes platform in folder when shared lib required', () => {
        artifact.sharedLib = true;

        expect(artifact.getOutputMetadata('lib')).toEqual({
          ext: 'js',
          file: 'index.js',
          folder: 'lib/node',
          path: './lib/node/index.js',
        });
      });

      it('ignores shared lib if not `lib` format', () => {
        artifact.sharedLib = true;

        expect(artifact.getOutputMetadata('esm')).toEqual({
          ext: 'js',
          file: 'index.js',
          folder: 'esm',
          path: './esm/index.js',
        });
      });
    });
  });

  describe('getPackageExports()', () => {
    it('adds exports based on input file and output name', () => {
      artifact.builds.push({ format: 'lib', platform: 'node', support: 'stable' });

      expect(artifact.getPackageExports()).toEqual({
        node: './lib/index.js',
      });
    });

    it('adds exports based on input file and output name when shared lib required', () => {
      artifact.sharedLib = true;
      artifact.builds.push({ format: 'lib', platform: 'node', support: 'stable' });

      expect(artifact.getPackageExports()).toEqual({
        node: './lib/node/index.js',
      });
    });

    it('supports subpath file exports when output name is not "index"', () => {
      artifact.outputName = 'sub';
      artifact.builds.push({ format: 'lib', platform: 'node', support: 'stable' });

      expect(artifact.getPackageExports()).toEqual({
        node: './lib/sub.js',
      });
    });

    it('supports conditional exports when there are multiple builds', () => {
      artifact.builds.push(
        { format: 'lib', platform: 'node', support: 'stable' },
        { format: 'mjs', platform: 'node', support: 'stable' },
        { format: 'cjs', platform: 'node', support: 'stable' },
      );

      expect(artifact.getPackageExports()).toEqual({
        node: {
          import: './mjs/index.mjs',
          require: './cjs/index.cjs',
          default: './lib/index.js',
        },
      });
    });

    it('skips `default` export when there is no `lib` build', () => {
      artifact.outputName = 'sub';
      artifact.builds.push(
        { format: 'mjs', platform: 'node', support: 'stable' },
        { format: 'cjs', platform: 'node', support: 'stable' },
      );

      expect(artifact.getPackageExports()).toEqual({
        node: {
          import: './mjs/sub.mjs',
          require: './cjs/sub.cjs',
        },
      });
    });

    it('changes export namespace to "browser" when a `browser` platform', () => {
      artifact.platform = 'browser';
      artifact.builds.push({ format: 'lib', platform: 'browser', support: 'stable' });

      expect(artifact.getPackageExports()).toEqual({
        browser: './lib/index.js',
      });
    });

    it('changes export namespace to "react-native" when a `native` platform', () => {
      artifact.platform = 'native';
      artifact.builds.push({ format: 'lib', platform: 'native', support: 'stable' });

      expect(artifact.getPackageExports()).toEqual({
        'react-native': './lib/index.js',
      });
    });
  });
});
