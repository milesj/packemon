import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { CodeArtifact } from '../../src/CodeArtifact';
import { Package } from '../../src/Package';
import { Project } from '../../src/Project';
import {
  getRollupConfig,
  getRollupExternals,
  getRollupOutputConfig,
} from '../../src/rollup/config';

jest.mock('@rollup/plugin-commonjs', () => () => 'commonjs()');
jest.mock('@rollup/plugin-json', () => () => 'json()');
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
  const artifact = new CodeArtifact(
    pkg ??
      new Package(new Project(fixturePath), fixturePath, {
        name: 'project',
        version: '0.0.0',
        packemon: {},
      }),
    [],
  );
  artifact.configGroup = 1;
  artifact.inputs = {
    [outputName]: inputFile,
  };
  artifact.startup();

  return artifact;
}

const binPlugin = expect.objectContaining({ name: 'packemon-add-bin-shebang' });

describe('getRollupConfig()', () => {
  const sharedPlugins = [
    `externals(${fixturePath.append('package.json')})`,
    'resolve()',
    'commonjs()',
    'json()',
    `babelInput(${fixturePath})`,
  ];

  const sharedNonNodePlugins = ['polyfillNode()', ...sharedPlugins];

  let artifact: CodeArtifact;

  beforeEach(() => {
    artifact = createArtifact('index', 'src/index.ts');
  });

  it('generates default input config for `browser` platform', () => {
    artifact.platform = 'browser';

    expect(getRollupConfig(artifact, {})).toEqual({
      cache: undefined,
      external: expect.any(Function),
      input: { index: srcInputFile },
      output: [],
      plugins: sharedNonNodePlugins,
      treeshake: true,
    });
  });

  it('generates default input config for `native` platform', () => {
    artifact.platform = 'native';

    expect(getRollupConfig(artifact, {})).toEqual({
      cache: undefined,
      external: expect.any(Function),
      input: { index: srcInputFile },
      output: [],
      plugins: sharedNonNodePlugins,
      treeshake: true,
    });
  });

  it('generates default input config for `node` platform', () => {
    artifact.platform = 'node';

    expect(getRollupConfig(artifact, {})).toEqual({
      cache: undefined,
      external: expect.any(Function),
      input: { index: srcInputFile },
      output: [],
      plugins: sharedPlugins,
      treeshake: true,
    });
  });

  it('generates an output config for each build', () => {
    artifact.builds.push({ format: 'lib' }, { format: 'esm' }, { format: 'mjs' });

    expect(getRollupConfig(artifact, {})).toEqual({
      cache: undefined,
      external: expect.any(Function),
      input: {
        index: srcInputFile,
      },
      output: [
        {
          assetFileNames: '../assets/[name]-[hash][extname]',
          banner: expect.any(String),
          chunkFileNames: 'bundle-[hash].js',
          dir: fixturePath.append('lib').path(),
          entryFileNames: '[name].js',
          exports: 'auto',
          format: 'cjs',
          originalFormat: 'lib',
          paths: {},
          plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
          preferConst: false,
          preserveModules: false,
          sourcemap: true,
          sourcemapExcludeSources: true,
        },
        {
          assetFileNames: '../assets/[name]-[hash][extname]',
          banner: expect.any(String),
          chunkFileNames: 'bundle-[hash].js',
          dir: fixturePath.append('esm').path(),
          entryFileNames: '[name].js',
          format: 'esm',
          originalFormat: 'esm',
          paths: {},
          plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
          preferConst: false,
          preserveModules: false,
          sourcemap: true,
          sourcemapExcludeSources: true,
        },
        {
          assetFileNames: '../assets/[name]-[hash][extname]',
          banner: expect.any(String),
          chunkFileNames: 'bundle-[hash].mjs',
          dir: fixturePath.append('mjs').path(),
          entryFileNames: '[name].mjs',
          format: 'esm',
          originalFormat: 'mjs',
          paths: {},
          plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
          preferConst: false,
          preserveModules: false,
          sourcemap: true,
          sourcemapExcludeSources: true,
        },
      ],
      plugins: sharedPlugins,
      treeshake: true,
    });
  });

  it('generates an accurate config if input/output are not "index"', () => {
    artifact.inputs = {
      server: 'src/server/core.ts',
    };
    artifact.builds.push({ format: 'lib' });

    expect(getRollupConfig(artifact, {})).toEqual({
      cache: undefined,
      external: expect.any(Function),
      input: {
        server: fixturePath.append('src/server/core.ts').path(),
      },
      output: [
        {
          assetFileNames: '../assets/[name]-[hash][extname]',
          banner: expect.any(String),
          chunkFileNames: 'bundle-[hash].js',
          dir: fixturePath.append('lib').path(),
          entryFileNames: '[name].js',
          exports: 'auto',
          format: 'cjs',
          originalFormat: 'lib',
          paths: {},
          plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
          preferConst: false,
          preserveModules: false,
          sourcemap: true,
          sourcemapExcludeSources: true,
        },
      ],
      plugins: sharedPlugins,
      treeshake: true,
    });
  });

  it('when not bundling, globs all source files, preserves modules, and doesnt treeshake', () => {
    artifact.bundle = false;
    artifact.builds.push({ format: 'lib' });

    expect(getRollupConfig(artifact, {})).toEqual({
      cache: undefined,
      external: expect.any(Function),
      input: [
        'src/index.ts',
        'src/client/index.ts',
        'src/other/index.ts',
        'src/server/core.ts',
        'src/test-utils/base.ts',
      ].map((f) => fixturePath.append(f).path()),
      output: [
        {
          assetFileNames: '../assets/[name]-[hash][extname]',
          chunkFileNames: '[name]-[hash].js',
          dir: fixturePath.append('lib').path(),
          entryFileNames: '[name].js',
          exports: 'auto',
          format: 'cjs',
          originalFormat: 'lib',
          paths: {},
          plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
          preferConst: false,
          preserveModules: true,
          sourcemap: true,
          sourcemapExcludeSources: true,
        },
      ],
      plugins: sharedPlugins,
      treeshake: false,
    });
  });

  it('inherits artifact rollup cache', () => {
    artifact.cache = { modules: [] };

    expect(getRollupConfig(artifact, {}).cache).toEqual({
      modules: [],
    });
  });

  it('includes analyzer plugin if `analyze` feature flag is on', () => {
    artifact.builds.push({ format: 'lib' });
    expect(getRollupConfig(artifact, { analyze: 'treemap' }).plugins).toEqual([
      ...sharedPlugins,
      'visualizer(treemap, stats-project-node-stable.html, project/node/stable)',
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

    it('errors for foreign inputs (not in the same artifact config)', () => {
      const foreignArtifact = createArtifact('other', 'src/other/index.ts', artifact.package);
      foreignArtifact.configGroup = 10;

      artifact.package.addArtifact(foreignArtifact);

      const parent = srcInputFile;
      const child = fixturePath.append('src/other/index.ts').path();

      try {
        getRollupExternals(artifact)(child, parent);
      } catch (error: unknown) {
        expect((error as Error).message).toContain('Unexpected foreign input import.');
      }

      expect(() => getRollupExternals(artifact)(child, srcInputFile)).toThrow(
        `Unexpected foreign input import. May only import sibling files within the same \`inputs\` configuration group. File "${parent}" attempted to import "${child}".`,
      );
    });
  });
});

describe('getRollupOutputConfig()', () => {
  let artifact: CodeArtifact;

  beforeEach(() => {
    artifact = createArtifact('index', 'src/index.ts');
    artifact.platform = 'node';
    artifact.support = 'stable';
  });

  it('generates default output config', () => {
    expect(getRollupOutputConfig(artifact, {}, 'lib')).toEqual({
      assetFileNames: '../assets/[name]-[hash][extname]',
      banner: expect.any(String),
      chunkFileNames: 'bundle-[hash].js',
      dir: fixturePath.append('lib').path(),
      entryFileNames: '[name].js',
      exports: 'auto',
      format: 'cjs',
      originalFormat: 'lib',
      paths: {},
      plugins: [`babelOutput(${fixturePath}, *)`, binPlugin],
      preferConst: false,
      preserveModules: false,
      sourcemap: true,
      sourcemapExcludeSources: true,
    });
  });

  it('changes output dir based on format', () => {
    artifact.platform = 'browser';
    artifact.support = 'stable';

    expect(getRollupOutputConfig(artifact, {}, 'esm').dir).toBe(fixturePath.append('esm').path());

    artifact.platform = 'node';
    artifact.support = 'stable';

    expect(getRollupOutputConfig(artifact, {}, 'mjs').dir).toBe(fixturePath.append('mjs').path());
  });

  describe('formats', () => {
    it('converts `lib` format to rollup "cjs" format', () => {
      expect(getRollupOutputConfig(artifact, {}, 'lib')).toEqual(
        expect.objectContaining({
          format: 'cjs',
          originalFormat: 'lib',
        }),
      );
    });

    it('converts `cjs` format to rollup "cjs" format', () => {
      expect(getRollupOutputConfig(artifact, {}, 'cjs')).toEqual(
        expect.objectContaining({
          format: 'cjs',
          originalFormat: 'cjs',
        }),
      );
    });

    it('converts `mjs` format to rollup "esm" format', () => {
      expect(getRollupOutputConfig(artifact, {}, 'mjs')).toEqual(
        expect.objectContaining({
          format: 'esm',
          originalFormat: 'mjs',
        }),
      );
    });

    it('converts `esm` format to rollup "esm" format', () => {
      artifact.platform = 'browser';

      expect(getRollupOutputConfig(artifact, {}, 'esm')).toEqual(
        expect.objectContaining({
          format: 'esm',
          originalFormat: 'esm',
        }),
      );
    });

    it('converts `umd` format to rollup "esm" format', () => {
      artifact.platform = 'browser';

      expect(getRollupOutputConfig(artifact, {}, 'umd')).toEqual(
        expect.objectContaining({
          format: 'esm',
          originalFormat: 'umd',
        }),
      );
    });
  });

  describe('chunks', () => {
    it('uses ".js" chunk extension for `lib` format', () => {
      expect(getRollupOutputConfig(artifact, {}, 'lib')).toEqual(
        expect.objectContaining({
          chunkFileNames: 'bundle-[hash].js',
          entryFileNames: '[name].js',
        }),
      );
    });

    it('uses ".js" chunk extension for `esm` format', () => {
      artifact.platform = 'browser';

      expect(getRollupOutputConfig(artifact, {}, 'esm')).toEqual(
        expect.objectContaining({
          chunkFileNames: 'bundle-[hash].js',
          entryFileNames: '[name].js',
        }),
      );
    });

    it('uses ".js" chunk extension for `umd` format', () => {
      artifact.platform = 'browser';

      expect(getRollupOutputConfig(artifact, {}, 'umd')).toEqual(
        expect.objectContaining({
          chunkFileNames: 'bundle-[hash].js',
          entryFileNames: '[name].js',
        }),
      );
    });

    it('uses ".cjs" chunk extension for `cjs` format', () => {
      expect(getRollupOutputConfig(artifact, {}, 'cjs')).toEqual(
        expect.objectContaining({
          chunkFileNames: 'bundle-[hash].cjs',
          entryFileNames: '[name].cjs',
        }),
      );
    });

    it('uses ".mjs" chunk extension for `mjs` format', () => {
      expect(getRollupOutputConfig(artifact, {}, 'mjs')).toEqual(
        expect.objectContaining({
          chunkFileNames: 'bundle-[hash].mjs',
          entryFileNames: '[name].mjs',
        }),
      );
    });
  });

  describe('exports', () => {
    it('enables auto-exports for `lib` format', () => {
      expect(getRollupOutputConfig(artifact, {}, 'lib').exports).toBe('auto');
    });

    it('enables auto-exports for `cjs` format', () => {
      expect(getRollupOutputConfig(artifact, {}, 'cjs').exports).toBe('auto');
    });

    it('disables auto-exports for `mjs` format', () => {
      expect(getRollupOutputConfig(artifact, {}, 'mjs').exports).toBeUndefined();
    });

    it('disables auto-exports for `esm` format', () => {
      artifact.platform = 'browser';

      expect(getRollupOutputConfig(artifact, {}, 'esm').exports).toBeUndefined();
    });

    it('disables auto-exports for `umd` format', () => {
      artifact.platform = 'browser';

      expect(getRollupOutputConfig(artifact, {}, 'umd').exports).toBeUndefined();
    });
  });

  it('enables `const` for future versions', () => {
    artifact.support = 'legacy';

    expect(getRollupOutputConfig(artifact, {}, 'lib').preferConst).toBe(false);

    artifact.support = 'stable';

    expect(getRollupOutputConfig(artifact, {}, 'lib').preferConst).toBe(false);

    artifact.support = 'current';

    expect(getRollupOutputConfig(artifact, {}, 'lib').preferConst).toBe(true);

    artifact.support = 'experimental';

    expect(getRollupOutputConfig(artifact, {}, 'lib').preferConst).toBe(true);
  });

  it('passes `namespace` to Babel as UMD name', () => {
    artifact.platform = 'browser';
    artifact.support = 'experimental';
    artifact.namespace = 'FooBar';

    expect(getRollupOutputConfig(artifact, {}, 'umd')).toEqual({
      assetFileNames: '../assets/[name]-[hash][extname]',
      banner: expect.any(String),
      chunkFileNames: 'bundle-[hash].js',
      dir: fixturePath.append('umd').path(),
      entryFileNames: '[name].js',
      format: 'esm',
      originalFormat: 'umd',
      paths: {},
      plugins: [`babelOutput(${fixturePath}, FooBar)`, binPlugin],
      preferConst: true,
      preserveModules: false,
      sourcemap: true,
      sourcemapExcludeSources: true,
    });
  });
});
