import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import BundleArtifact from '../../src/BundleArtifact';
import { getRollupConfig, getRollupOutputConfig } from '../../src/rollup/config';
import Project from '../../src/Project';
import Package from '../../src/Package';

jest.mock('@rollup/plugin-commonjs', () => () => 'commonjs()');
jest.mock('@rollup/plugin-node-resolve', () => () => 'resolve()');
jest.mock('@rollup/plugin-babel', () => ({
  getBabelInputPlugin: (options: any) => `babelInput(${options.filename})`,
  getBabelOutputPlugin: (options: any) =>
    `babelOutput(${options.filename}, ${options.moduleId || '*'})`,
}));
jest.mock('rollup-plugin-node-externals', () => (options: any) =>
  `externals(${options.packagePath})`,
);
jest.mock('rollup-plugin-visualizer', () => (options: any) =>
  `visualizer(${options.template}, ${options.filename}, ${options.title})`,
);

const fixturePath = new Path(getFixturePath('project-rollup'));
const srcInputFile = fixturePath.append('src/index.ts').path();

function createArtifact(outputName: string, inputFile: string, pkg?: Package) {
  const artifact = new BundleArtifact(
    pkg ||
      new Package(new Project(fixturePath), fixturePath, {
        name: 'project',
        version: '0.0.0',
        packemon: {},
      }),
    [],
  );
  artifact.outputName = outputName;
  artifact.inputFile = inputFile;
  artifact.startup();

  return artifact;
}

describe('getRollupConfig()', () => {
  const sharedPlugins = [
    `externals(${fixturePath.append('package.json')})`,
    'resolve()',
    'commonjs()',
    `babelInput(${fixturePath})`,
  ];

  let artifact: BundleArtifact;

  beforeEach(() => {
    artifact = createArtifact('index', 'src/index.ts');
  });

  it('generates default input config', () => {
    expect(getRollupConfig(artifact, {})).toEqual({
      cache: undefined,
      external: [],
      input: srcInputFile,
      output: [],
      plugins: sharedPlugins,
      treeshake: true,
    });
  });

  it('inherits artifact rollup cache', () => {
    artifact.cache = { modules: [] };

    expect(getRollupConfig(artifact, {}).cache).toEqual({
      modules: [],
    });
  });

  it('includes analyzer plugin if `analyze` feature flag is on', () => {
    expect(getRollupConfig(artifact, { analyze: 'treemap' }).plugins).toEqual([
      ...sharedPlugins,
      'visualizer(treemap, stats-e000d9e1.html, project/index)',
    ]);
  });

  describe('externals', () => {
    beforeEach(() => {
      // Add self
      artifact.package.addArtifact(artifact);
    });

    it('adds external for self', () => {
      expect(getRollupConfig(artifact, {}).external).toEqual([srcInputFile]);
    });

    it('adds externals for sibling artifacts', () => {
      artifact.package.addArtifact(
        createArtifact('client', 'src/client/index.ts', artifact.package),
      );

      artifact.package.addArtifact(
        createArtifact('server', 'src/server/core.ts', artifact.package),
      );

      artifact.package.addArtifact(
        createArtifact('test', 'src/test-utils/base.ts', artifact.package),
      );

      expect(getRollupConfig(artifact, {}).external).toEqual([
        srcInputFile,
        fixturePath.append('src/client/index.ts').path(),
        fixturePath.append('src/server/core.ts').path(),
        fixturePath.append('src/test-utils/base.ts').path(),
      ]);
    });
  });
});

describe('getRollupOutputConfig()', () => {
  let artifact: BundleArtifact;

  beforeEach(() => {
    artifact = createArtifact('index', 'src/index.ts');
  });

  it('generates default output config', () => {
    expect(
      getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'stable' }),
    ).toEqual({
      assetFileNames: '../assets/[name]-[hash][extname]',
      chunkFileNames: '[name]-[hash].js',
      dir: fixturePath.append('lib').path(),
      entryFileNames: '[name].js',
      exports: 'auto',
      format: 'cjs',
      originalFormat: 'lib',
      paths: {},
      plugins: [`babelOutput(${fixturePath}, *)`],
      preferConst: false,
      sourcemap: false,
      sourcemapExcludeSources: true,
    });
  });

  it('changes output dir based on format', () => {
    expect(
      getRollupOutputConfig(artifact, {}, { format: 'esm', platform: 'browser', support: 'stable' })
        .dir,
    ).toBe(fixturePath.append('esm').path());

    expect(
      getRollupOutputConfig(artifact, {}, { format: 'mjs', platform: 'node', support: 'stable' })
        .dir,
    ).toBe(fixturePath.append('mjs').path());
  });

  describe('formats', () => {
    it('converts `lib` format to rollup "cjs" format', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'stable' }),
      ).toEqual(
        expect.objectContaining({
          format: 'cjs',
          originalFormat: 'lib',
        }),
      );
    });

    it('converts `cjs` format to rollup "cjs" format', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'cjs', platform: 'node', support: 'stable' }),
      ).toEqual(
        expect.objectContaining({
          format: 'cjs',
          originalFormat: 'cjs',
        }),
      );
    });

    it('converts `mjs` format to rollup "esm" format', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'mjs', platform: 'node', support: 'stable' }),
      ).toEqual(
        expect.objectContaining({
          format: 'esm',
          originalFormat: 'mjs',
        }),
      );
    });

    it('converts `esm` format to rollup "esm" format', () => {
      expect(
        getRollupOutputConfig(
          artifact,
          {},
          { format: 'esm', platform: 'browser', support: 'stable' },
        ),
      ).toEqual(
        expect.objectContaining({
          format: 'esm',
          originalFormat: 'esm',
        }),
      );
    });

    it('converts `umd` format to rollup "esm" format', () => {
      expect(
        getRollupOutputConfig(
          artifact,
          {},
          { format: 'umd', platform: 'browser', support: 'stable' },
        ),
      ).toEqual(
        expect.objectContaining({
          format: 'esm',
          originalFormat: 'umd',
        }),
      );
    });
  });

  describe('chunks', () => {
    it('uses ".js" chunk extension for `lib` format', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'stable' }),
      ).toEqual(
        expect.objectContaining({
          chunkFileNames: '[name]-[hash].js',
          entryFileNames: '[name].js',
        }),
      );
    });

    it('uses ".js" chunk extension for `esm` format', () => {
      expect(
        getRollupOutputConfig(
          artifact,
          {},
          { format: 'esm', platform: 'browser', support: 'stable' },
        ),
      ).toEqual(
        expect.objectContaining({
          chunkFileNames: '[name]-[hash].js',
          entryFileNames: '[name].js',
        }),
      );
    });

    it('uses ".js" chunk extension for `umd` format', () => {
      expect(
        getRollupOutputConfig(
          artifact,
          {},
          { format: 'umd', platform: 'browser', support: 'stable' },
        ),
      ).toEqual(
        expect.objectContaining({
          chunkFileNames: '[name]-[hash].js',
          entryFileNames: '[name].js',
        }),
      );
    });

    it('uses ".cjs" chunk extension for `cjs` format', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'cjs', platform: 'node', support: 'stable' }),
      ).toEqual(
        expect.objectContaining({
          chunkFileNames: '[name]-[hash].cjs',
          entryFileNames: '[name].cjs',
        }),
      );
    });

    it('uses ".mjs" chunk extension for `mjs` format', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'mjs', platform: 'node', support: 'stable' }),
      ).toEqual(
        expect.objectContaining({
          chunkFileNames: '[name]-[hash].mjs',
          entryFileNames: '[name].mjs',
        }),
      );
    });
  });

  describe('externals', () => {
    beforeEach(() => {
      // Add self
      artifact.package.addArtifact(artifact);
    });

    it('adds external for self', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'stable' })
          .paths,
      ).toEqual({ [srcInputFile]: './index.js' });
    });

    it('adds externals for sibling artifacts', () => {
      artifact.package.addArtifact(
        createArtifact('client', 'src/client/index.ts', artifact.package),
      );

      artifact.package.addArtifact(
        createArtifact('server', 'src/server/core.ts', artifact.package),
      );

      artifact.package.addArtifact(
        createArtifact('test', 'src/test-utils/base.ts', artifact.package),
      );

      expect(
        getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'stable' })
          .paths,
      ).toEqual({
        [srcInputFile]: './index.js',
        [fixturePath.append('src/client/index.ts').path()]: './client.js',
        [fixturePath.append('src/server/core.ts').path()]: './server.js',
        [fixturePath.append('src/test-utils/base.ts').path()]: './test.js',
      });
    });
  });
});
