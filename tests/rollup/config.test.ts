import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import BundleArtifact from '../../src/BundleArtifact';
import Package from '../../src/Package';
import Project from '../../src/Project';
import {
  getRollupConfig,
  getRollupExternals,
  getRollupOutputConfig,
} from '../../src/rollup/config';

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
jest.mock('rollup-plugin-polyfill-node', () => () => `polyfillNode()`);
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
  artifact.configGroup = 1;
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
      external: expect.any(Function),
      input: srcInputFile,
      output: [],
      plugins: sharedPlugins,
      treeshake: true,
    });
  });

  it('generates an output config for each build', () => {
    artifact.builds.push(
      { format: 'lib', platform: 'node', support: 'stable' },
      { format: 'lib', platform: 'browser', support: 'legacy' },
      { format: 'esm', platform: 'browser', support: 'current' },
      { format: 'mjs', platform: 'node', support: 'experimental' },
    );

    expect(getRollupConfig(artifact, {})).toEqual({
      cache: undefined,
      external: expect.any(Function),
      input: srcInputFile,
      output: [
        {
          assetFileNames: '../assets/[name]-[hash][extname]',
          banner: expect.any(String),
          chunkFileNames: 'index-[hash].js',
          dir: fixturePath.append('lib').path(),
          entryFileNames: 'index.js',
          exports: 'auto',
          format: 'cjs',
          originalFormat: 'lib',
          paths: {},
          plugins: [`babelOutput(${fixturePath}, *)`],
          preferConst: false,
          sourcemap: false,
          sourcemapExcludeSources: true,
        },
        {
          assetFileNames: '../assets/[name]-[hash][extname]',
          banner: expect.any(String),
          chunkFileNames: 'index-[hash].js',
          dir: fixturePath.append('lib').path(),
          entryFileNames: 'index.js',
          exports: 'auto',
          format: 'cjs',
          originalFormat: 'lib',
          paths: {},
          plugins: ['polyfillNode()', `babelOutput(${fixturePath}, *)`],
          preferConst: false,
          sourcemap: true,
          sourcemapExcludeSources: true,
        },
        {
          assetFileNames: '../assets/[name]-[hash][extname]',
          banner: expect.any(String),
          chunkFileNames: 'index-[hash].js',
          dir: fixturePath.append('esm').path(),
          entryFileNames: 'index.js',
          format: 'esm',
          originalFormat: 'esm',
          paths: {},
          plugins: ['polyfillNode()', `babelOutput(${fixturePath}, *)`],
          preferConst: true,
          sourcemap: true,
          sourcemapExcludeSources: true,
        },
        {
          assetFileNames: '../assets/[name]-[hash][extname]',
          banner: expect.any(String),
          chunkFileNames: 'index-[hash].mjs',
          dir: fixturePath.append('mjs').path(),
          entryFileNames: 'index.mjs',
          format: 'esm',
          originalFormat: 'mjs',
          paths: {},
          plugins: [`babelOutput(${fixturePath}, *)`],
          preferConst: true,
          sourcemap: false,
          sourcemapExcludeSources: true,
        },
      ],
      plugins: sharedPlugins,
      treeshake: true,
    });
  });

  it('generates an accurate config if input/output are not "index"', () => {
    artifact.inputFile = 'src/server/core.ts';
    artifact.outputName = 'server';
    artifact.builds.push({ format: 'lib', platform: 'node', support: 'stable' });

    expect(getRollupConfig(artifact, {})).toEqual({
      cache: undefined,
      external: expect.any(Function),
      input: fixturePath.append('src/server/core.ts').path(),
      output: [
        {
          assetFileNames: '../assets/[name]-[hash][extname]',
          banner: expect.any(String),
          chunkFileNames: 'server-[hash].js',
          dir: fixturePath.append('lib').path(),
          entryFileNames: 'server.js',
          exports: 'auto',
          format: 'cjs',
          originalFormat: 'lib',
          paths: {},
          plugins: [`babelOutput(${fixturePath}, *)`],
          preferConst: false,
          sourcemap: false,
          sourcemapExcludeSources: true,
        },
      ],
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
      'visualizer(treemap, stats-project-index.html, project/index)',
    ]);
  });

  describe('externals', () => {
    beforeEach(() => {
      // Add self
      artifact.package.addArtifact(artifact);
    });

    it('returns false for self', () => {
      expect(getRollupExternals(artifact)(srcInputFile)).toBe(false);
    });

    it('returns false for random files', () => {
      expect(getRollupExternals(artifact)('some/random/file.js')).toBe(false);
    });

    it('returns true for sibling inputs in the same artifact config', () => {
      artifact.package.addArtifact(
        createArtifact('client', 'src/client/index.ts', artifact.package),
      );

      artifact.package.addArtifact(
        createArtifact('server', 'src/server/core.ts', artifact.package),
      );

      artifact.package.addArtifact(
        createArtifact('test', 'src/test-utils/base.ts', artifact.package),
      );

      const ext = getRollupExternals(artifact);

      expect(ext(fixturePath.append('src/client/index.ts').path())).toBe(true);
      expect(ext(fixturePath.append('src/server/core.ts').path())).toBe(true);
      expect(ext(fixturePath.append('src/test-utils/base.ts').path())).toBe(true);
    });

    it('errors for foreign inputs (not in the same artifact config)', () => {
      const foreignArtifact = createArtifact('other', 'src/other/index.ts', artifact.package);
      foreignArtifact.configGroup = 10;

      artifact.package.addArtifact(foreignArtifact);

      const parent = srcInputFile;
      const child = fixturePath.append('src/other/index.ts').path();

      try {
        getRollupExternals(artifact)(child, parent);
      } catch (error) {
        expect(error.message).toContain('Unexpected foreign input import.');
      }

      expect(() => getRollupExternals(artifact)(child, srcInputFile)).toThrow(
        `Unexpected foreign input import. May only import sibling files within the same \`inputs\` configuration group. File "${parent}" attempted to import "${child}".`,
      );
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
      banner: expect.any(String),
      chunkFileNames: 'index-[hash].js',
      dir: fixturePath.append('lib').path(),
      entryFileNames: 'index.js',
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
          chunkFileNames: 'index-[hash].js',
          entryFileNames: 'index.js',
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
          chunkFileNames: 'index-[hash].js',
          entryFileNames: 'index.js',
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
          chunkFileNames: 'index-[hash].js',
          entryFileNames: 'index.js',
        }),
      );
    });

    it('uses ".cjs" chunk extension for `cjs` format', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'cjs', platform: 'node', support: 'stable' }),
      ).toEqual(
        expect.objectContaining({
          chunkFileNames: 'index-[hash].cjs',
          entryFileNames: 'index.cjs',
        }),
      );
    });

    it('uses ".mjs" chunk extension for `mjs` format', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'mjs', platform: 'node', support: 'stable' }),
      ).toEqual(
        expect.objectContaining({
          chunkFileNames: 'index-[hash].mjs',
          entryFileNames: 'index.mjs',
        }),
      );
    });
  });

  describe('externals', () => {
    beforeEach(() => {
      // Add self
      artifact.package.addArtifact(artifact);
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
        [fixturePath.append('src/client/index.ts').path()]: './client.js',
        [fixturePath.append('src/server/core.ts').path()]: './server.js',
        [fixturePath.append('src/test-utils/base.ts').path()]: './test.js',
      });
    });
  });

  describe('exports', () => {
    it('enables auto-exports for `lib` format', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'stable' })
          .exports,
      ).toBe('auto');
    });

    it('enables auto-exports for `cjs` format', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'cjs', platform: 'node', support: 'stable' })
          .exports,
      ).toBe('auto');
    });

    it('disables auto-exports for `mjs` format', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'mjs', platform: 'node', support: 'stable' })
          .exports,
      ).toBeUndefined();
    });

    it('disables auto-exports for `esm` format', () => {
      expect(
        getRollupOutputConfig(
          artifact,
          {},
          { format: 'esm', platform: 'browser', support: 'stable' },
        ).exports,
      ).toBeUndefined();
    });

    it('disables auto-exports for `umd` format', () => {
      expect(
        getRollupOutputConfig(
          artifact,
          {},
          { format: 'umd', platform: 'browser', support: 'stable' },
        ).exports,
      ).toBeUndefined();
    });
  });

  it('defines a shebang banner when output name is "bin"', () => {
    artifact.outputName = 'bin';

    expect(
      getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'stable' })
        .banner,
    ).toContain('#!/usr/bin/env node\n');

    artifact.outputName = 'index';

    expect(
      getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'stable' })
        .banner,
    ).not.toContain('#!/usr/bin/env node\n');
  });

  it('enables `const` for future versions', () => {
    expect(
      getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'legacy' })
        .preferConst,
    ).toBe(false);

    expect(
      getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'stable' })
        .preferConst,
    ).toBe(false);

    expect(
      getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'current' })
        .preferConst,
    ).toBe(true);

    expect(
      getRollupOutputConfig(
        artifact,
        {},
        { format: 'lib', platform: 'node', support: 'experimental' },
      ).preferConst,
    ).toBe(true);
  });

  describe('sourcemaps', () => {
    it('enables when platform is `browser`', () => {
      expect(
        getRollupOutputConfig(
          artifact,
          {},
          { format: 'lib', platform: 'browser', support: 'stable' },
        ),
      ).toEqual(
        expect.objectContaining({
          sourcemap: true,
          sourcemapExcludeSources: true,
        }),
      );
    });

    it('enables when platform is `native`', () => {
      expect(
        getRollupOutputConfig(
          artifact,
          {},
          { format: 'lib', platform: 'native', support: 'stable' },
        ),
      ).toEqual(
        expect.objectContaining({
          sourcemap: true,
          sourcemapExcludeSources: true,
        }),
      );
    });

    it('enables when `analyze` feature flag is on', () => {
      expect(
        getRollupOutputConfig(
          artifact,
          { analyze: 'network' },
          { format: 'lib', platform: 'node', support: 'stable' },
        ),
      ).toEqual(
        expect.objectContaining({
          sourcemap: true,
          sourcemapExcludeSources: true,
        }),
      );
    });

    it('disables when platform is `node`', () => {
      expect(
        getRollupOutputConfig(artifact, {}, { format: 'lib', platform: 'node', support: 'stable' }),
      ).toEqual(
        expect.objectContaining({
          sourcemap: false,
          sourcemapExcludeSources: true,
        }),
      );
    });
  });

  it('passes `namespace` to Babel as UMD name', () => {
    artifact.namespace = 'FooBar';

    expect(
      getRollupOutputConfig(
        artifact,
        {},
        { format: 'umd', platform: 'browser', support: 'experimental' },
      ),
    ).toEqual({
      assetFileNames: '../assets/[name]-[hash][extname]',
      banner: expect.any(String),
      chunkFileNames: 'index-[hash].js',
      dir: fixturePath.append('umd').path(),
      entryFileNames: 'index.js',
      format: 'esm',
      originalFormat: 'umd',
      paths: {},
      plugins: ['polyfillNode()', `babelOutput(${fixturePath}, FooBar)`],
      preferConst: true,
      sourcemap: true,
      sourcemapExcludeSources: true,
    });
  });
});
