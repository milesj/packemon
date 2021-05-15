import fs from 'fs-extra';
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
jest.mock('rollup');

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
    artifact.inputs = { index: 'src/index.ts' };
    artifact.startup();
  });

  it('sets correct metadata', () => {
    artifact.builds.push({ format: 'lib' }, { format: 'cjs' });

    expect(artifact.getLabel()).toBe('node:stable:lib,cjs');
    expect(artifact.getBuildTargets()).toEqual(['lib', 'cjs']);
    expect(artifact.toString()).toBe('code (node:stable:lib,cjs)');
    expect(artifact.getStatsTitle()).toBe('project/node/stable');
    expect(artifact.getStatsFileName()).toBe('stats-project-node-stable.html');
  });

  describe('build()', () => {
    let bundleWriteSpy: jest.SpyInstance;

    beforeEach(() => {
      bundleWriteSpy = jest.fn(() => ({ output: [{ code: 'code' }] }));

      mockSpy(rollup)
        .mockReset()
        .mockImplementation(() => ({
          cache: { cache: true },
          write: bundleWriteSpy,
        }));

      jest
        .spyOn(artifact.package, 'getFeatureFlags')
        .mockImplementation(() => ({ typescript: true }));

      artifact.builds.push({ format: 'lib' }, { format: 'cjs' }, { format: 'esm' });
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

  describe('cleanup()', () => {
    it('removes visualizer HTML files', async () => {
      await artifact.cleanup();

      expect(fs.remove).toHaveBeenCalledWith(
        fixturePath.append('stats-project-node-stable.html').path(),
      );
    });
  });

  describe('getInputPaths()', () => {
    it('returns an absolute path for every input', () => {
      expect(artifact.getInputPaths()).toEqual({
        index: fixturePath.append('src/index.ts').path(),
      });
    });
  });

  describe('getBuildOutput()', () => {
    beforeEach(() => {
      artifact.platform = 'node';
    });

    it('returns metadata for `lib` format', () => {
      expect(artifact.getBuildOutput('lib', 'index')).toEqual({
        ext: 'js',
        file: 'index.js',
        folder: 'lib',
        path: './lib/index.js',
      });
    });

    it('returns metadata for `esm` format', () => {
      expect(artifact.getBuildOutput('esm', 'index')).toEqual({
        ext: 'js',
        file: 'index.js',
        folder: 'esm',
        path: './esm/index.js',
      });
    });

    it('returns metadata for `umd` format', () => {
      expect(artifact.getBuildOutput('umd', 'index')).toEqual({
        ext: 'js',
        file: 'index.js',
        folder: 'umd',
        path: './umd/index.js',
      });
    });

    it('returns metadata for `cjs` format', () => {
      expect(artifact.getBuildOutput('cjs', 'index')).toEqual({
        ext: 'cjs',
        file: 'index.cjs',
        folder: 'cjs',
        path: './cjs/index.cjs',
      });
    });

    it('returns metadata for `mjs` format', () => {
      expect(artifact.getBuildOutput('mjs', 'index')).toEqual({
        ext: 'mjs',
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
          file: 'index.js',
          folder: 'lib/node',
          path: './lib/node/index.js',
        });
      });

      it('ignores shared lib if not `lib` format', () => {
        artifact.sharedLib = true;

        expect(artifact.getBuildOutput('esm', 'index')).toEqual({
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
      artifact.builds.push({ format: 'lib' });

      expect(artifact.getPackageExports()).toEqual({
        './index': {
          node: './lib/index.js',
        },
      });
    });

    it('adds exports based on input file and output name when shared lib required', () => {
      artifact.sharedLib = true;
      artifact.builds.push({ format: 'lib' });

      expect(artifact.getPackageExports()).toEqual({
        './index': {
          node: './lib/node/index.js',
        },
      });
    });

    it('supports subpath file exports when output name is not "index"', () => {
      artifact.inputs = { sub: './src/sub.ts' };
      artifact.builds.push({ format: 'lib' });

      expect(artifact.getPackageExports()).toEqual({
        './sub': {
          node: './lib/sub.js',
        },
      });
    });

    it('supports conditional exports when there are multiple builds', () => {
      artifact.builds.push({ format: 'lib' }, { format: 'mjs' }, { format: 'cjs' });

      expect(artifact.getPackageExports()).toEqual({
        './index': {
          node: {
            import: './mjs/index.mjs',
            require: './cjs/index.cjs',
            default: './lib/index.js',
          },
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
        './index': {
          browser: './lib/index.js',
        },
      });
    });

    it('changes export namespace to "react-native" when a `native` platform', () => {
      artifact.platform = 'native';
      artifact.builds.push({ format: 'lib' });

      expect(artifact.getPackageExports()).toEqual({
        './index': {
          'react-native': './lib/index.js',
        },
      });
    });
  });
});
