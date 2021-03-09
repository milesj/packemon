import fs from 'fs-extra';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { BundleArtifact } from '../src/BundleArtifact';
import { Package } from '../src/Package';
import { Project } from '../src/Project';
import { BundleBuild, TypesBuild } from '../src/types';
import { TypesArtifact } from '../src/TypesArtifact';
import { TestArtifact } from './helpers';

describe('Package', () => {
  const fixturePath = getFixturePath('workspaces-feature-flags');
  let project: Project;
  let pkg: Package;

  function createTestArtifacts() {
    const a = new TestArtifact(pkg, []);
    const b = new TestArtifact(pkg, []);
    const c = new TestArtifact(pkg, []);

    return [a, b, c];
  }

  function createBundleArtifact(builds: BundleBuild[]) {
    const artifact = new BundleArtifact(pkg, builds);
    artifact.inputFile = 'src/index.ts';
    artifact.outputName = 'index';

    artifact.build = () => Promise.resolve();

    return artifact;
  }

  function createTypesArtifact(builds: TypesBuild[]) {
    const artifact = new TypesArtifact(pkg, builds);

    artifact.build = () => Promise.resolve();

    return artifact;
  }

  function loadPackage(name: string, customProject?: Project): Package {
    const pkgPath = new Path(fixturePath, 'packages', name);

    return new Package(
      customProject || project,
      pkgPath,
      fs.readJsonSync(pkgPath.append('package.json').path()),
    );
  }

  beforeEach(() => {
    project = new Project(fixturePath);
    pkg = loadPackage('common');
  });

  it('sets properties on instantiation', () => {
    expect(pkg.project).toBe(project);
    expect(pkg.path).toEqual(new Path(fixturePath, 'packages/common'));
    expect(pkg.packageJsonPath).toEqual(new Path(fixturePath, 'packages/common/package.json'));
    expect(pkg.packageJson).toEqual({
      name: 'flag-common',
    });
  });

  describe('addArtifact()', () => {
    it('adds an artifact and calls `startup`', () => {
      const artifact = new TestArtifact(pkg, []);
      const spy = jest.spyOn(artifact, 'startup');

      pkg.addArtifact(artifact);

      expect(pkg.artifacts).toEqual([artifact]);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('build()', () => {
    let writeSpy: jest.SpyInstance;

    beforeEach(() => {
      writeSpy = jest.spyOn(fs, 'writeJson').mockImplementation();
    });

    afterEach(() => {
      writeSpy.mockRestore();
    });

    it('calls `build` on each artifact', async () => {
      const [a, b, c] = createTestArtifacts();
      const aSpy = jest.spyOn(a, 'build');
      const bSpy = jest.spyOn(b, 'build');
      const cSpy = jest.spyOn(c, 'build');

      pkg.addArtifact(a);
      pkg.addArtifact(b);
      pkg.addArtifact(c);

      await pkg.build({ concurrency: 1 });

      expect(aSpy).toHaveBeenCalledWith({ concurrency: 1 });
      expect(bSpy).toHaveBeenCalledWith({ concurrency: 1 });
      expect(cSpy).toHaveBeenCalledWith({ concurrency: 1 });
    });

    it('calls `preBuild` and `postBuild` when building', async () => {
      const artifact = new TestArtifact(pkg, []);
      const preSpy = jest.spyOn(artifact, 'build');
      const postSpy = jest.spyOn(artifact, 'build');

      pkg.addArtifact(artifact);

      await pkg.build({ addEngines: true });

      expect(preSpy).toHaveBeenCalledWith({ addEngines: true });
      expect(postSpy).toHaveBeenCalledWith({ addEngines: true });
    });

    it('sets passed state and result time', async () => {
      const artifact = new TestArtifact(pkg, []);

      pkg.addArtifact(artifact);

      expect(artifact.state).toBe('pending');
      expect(artifact.buildResult.time).toBe(0);

      await pkg.build({});

      expect(artifact.state).toBe('passed');
      expect(artifact.buildResult.time).not.toBe(0);
    });

    it('sets failed state and result time on error', async () => {
      const artifact = new TestArtifact(pkg, []);

      jest.spyOn(artifact, 'build').mockImplementation(() => {
        throw new Error('Whoops');
      });

      pkg.addArtifact(artifact);

      expect(artifact.state).toBe('pending');

      try {
        await pkg.build({});
      } catch (error) {
        expect(error).toEqual(new Error('Whoops'));
      }

      expect(artifact.state).toBe('failed');
    });

    it('syncs `package.json` when done building', async () => {
      const artifact = new TestArtifact(pkg, []);
      const spy = jest.spyOn(pkg, 'syncPackageJson');

      pkg.addArtifact(artifact);

      await pkg.build({});

      expect(spy).toHaveBeenCalled();
    });

    describe('entries', () => {
      describe('main', () => {
        it('adds "main" for node `lib` format', async () => {
          pkg.addArtifact(
            createBundleArtifact([{ format: 'lib', platform: 'node', support: 'stable' }]),
          );

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              main: './lib/index.js',
            }),
          );
        });

        it('adds "main" for node `cjs` format', async () => {
          pkg.addArtifact(
            createBundleArtifact([{ format: 'cjs', platform: 'node', support: 'stable' }]),
          );

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              main: './cjs/index.cjs',
              type: 'commonjs',
            }),
          );
        });

        it('adds "main" for node `mjs` format', async () => {
          pkg.addArtifact(
            createBundleArtifact([{ format: 'mjs', platform: 'node', support: 'stable' }]),
          );

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              main: './mjs/index.mjs',
              type: 'module',
            }),
          );
        });

        it('adds "main" for browser `lib` format', async () => {
          const a = createBundleArtifact([
            { format: 'lib', platform: 'browser', support: 'stable' },
          ]);
          a.platform = 'browser';
          pkg.addArtifact(a);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              main: './lib/index.js',
            }),
          );
        });

        it('adds "main" for native `lib` format', async () => {
          const a = createBundleArtifact([
            { format: 'lib', platform: 'native', support: 'stable' },
          ]);
          a.platform = 'native';
          pkg.addArtifact(a);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              main: './lib/index.js',
            }),
          );
        });

        it('doesnt add "main" if output name is not "index"', async () => {
          const a = createBundleArtifact([{ format: 'lib', platform: 'node', support: 'stable' }]);
          a.outputName = 'server';
          pkg.addArtifact(a);

          await pkg.build({});

          expect(pkg.packageJson.main).toBeUndefined();
        });

        it('adds "main" when using shared `lib` format', async () => {
          const a = createBundleArtifact([{ format: 'lib', platform: 'node', support: 'stable' }]);
          a.sharedLib = true;
          pkg.addArtifact(a);

          const b = createBundleArtifact([
            { format: 'lib', platform: 'browser', support: 'stable' },
          ]);
          b.sharedLib = true;
          b.platform = 'browser';
          pkg.addArtifact(b);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              main: './lib/node/index.js',
            }),
          );
        });

        it('node "main" always takes precedence when multiple `lib` formats', async () => {
          const b = createBundleArtifact([
            { format: 'lib', platform: 'browser', support: 'stable' },
          ]);
          b.sharedLib = true;
          b.platform = 'browser';
          pkg.addArtifact(b);

          const a = createBundleArtifact([{ format: 'lib', platform: 'node', support: 'stable' }]);
          a.sharedLib = true;
          pkg.addArtifact(a);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              main: './lib/node/index.js',
            }),
          );
        });
      });

      describe('module', () => {
        it('adds "module" for node `mjs` format', async () => {
          pkg.addArtifact(
            createBundleArtifact([{ format: 'mjs', platform: 'node', support: 'stable' }]),
          );

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              module: './mjs/index.mjs',
            }),
          );
        });

        it('adds "module" for browser `esm` format', async () => {
          const a = createBundleArtifact([
            { format: 'esm', platform: 'browser', support: 'stable' },
          ]);
          a.platform = 'browser';
          pkg.addArtifact(a);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              module: './esm/index.js',
            }),
          );
        });
      });

      describe('types', () => {
        it('adds "types" when a types artifact exists', async () => {
          pkg.addArtifact(createTypesArtifact([]));

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              types: './dts/index.d.ts',
            }),
          );
        });
      });

      describe('bin', () => {
        it('adds "bin" for node `lib` format', async () => {
          const a = createBundleArtifact([{ format: 'lib', platform: 'node', support: 'stable' }]);
          a.outputName = 'bin';
          pkg.addArtifact(a);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              bin: './lib/bin.js',
            }),
          );
        });

        it('adds "bin" for node `cjs` format', async () => {
          const a = createBundleArtifact([{ format: 'cjs', platform: 'node', support: 'stable' }]);
          a.outputName = 'bin';
          pkg.addArtifact(a);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              bin: './cjs/bin.cjs',
            }),
          );
        });

        it('adds "bin" for node `mjs` format', async () => {
          const a = createBundleArtifact([{ format: 'mjs', platform: 'node', support: 'stable' }]);
          a.outputName = 'bin';
          pkg.addArtifact(a);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              bin: './mjs/bin.mjs',
            }),
          );
        });

        it('doesnt add "bin" if value is an object', async () => {
          pkg.addArtifact(
            createBundleArtifact([{ format: 'lib', platform: 'node', support: 'stable' }]),
          );

          pkg.packageJson.bin = {};

          await pkg.build({});

          expect(pkg.packageJson.bin).toEqual({});
        });
      });

      describe('files', () => {
        it('adds "files" folder for each format format', async () => {
          pkg.addArtifact(
            createBundleArtifact([
              { format: 'cjs', platform: 'node', support: 'stable' },
              { format: 'lib', platform: 'node', support: 'stable' },
            ]),
          );

          pkg.addArtifact(
            createBundleArtifact([{ format: 'umd', platform: 'browser', support: 'stable' }]),
          );

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              files: [
                'cjs/**/*.{cjs,map}',
                'lib/**/*.{js,map}',
                'src/**/*.{ts,tsx,json}',
                'umd/**/*.{js,map}',
              ],
            }),
          );
        });

        it('merges with existing "files" list', async () => {
          pkg.packageJson.files = ['templates/', 'test.js'];

          const art = createBundleArtifact([
            { format: 'lib', platform: 'browser', support: 'stable' },
            { format: 'esm', platform: 'browser', support: 'stable' },
          ]);
          art.inputFile = 'src/index.jsx';

          pkg.addArtifact(art);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              files: [
                'esm/**/*.{js,map}',
                'lib/**/*.{js,map}',
                'src/**/*.{js,jsx,json}',
                'templates/',
                'test.js',
              ],
            }),
          );
        });

        it('determines source "js" files', async () => {
          const art = createBundleArtifact([]);
          art.inputFile = 'src/index.js';

          pkg.addArtifact(art);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              files: ['src/**/*.{js,jsx,json}'],
            }),
          );
        });

        it('determines source "jsx" files', async () => {
          const art = createBundleArtifact([]);
          art.inputFile = 'src/index.jsx';

          pkg.addArtifact(art);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              files: ['src/**/*.{js,jsx,json}'],
            }),
          );
        });

        it('determines source "cjs" files', async () => {
          const art = createBundleArtifact([]);
          art.inputFile = 'src/index.cjs';

          pkg.addArtifact(art);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              files: ['src/**/*.{js,cjs,json}'],
            }),
          );
        });

        it('determines source "mjs" files', async () => {
          const art = createBundleArtifact([]);
          art.inputFile = 'src/index.mjs';

          pkg.addArtifact(art);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              files: ['src/**/*.{mjs,json}'],
            }),
          );
        });

        it('determines source "ts" files', async () => {
          const art = createBundleArtifact([]);
          art.inputFile = 'src/index.ts';

          pkg.addArtifact(art);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              files: ['src/**/*.{ts,tsx,json}'],
            }),
          );
        });

        it('determines source "tsx" files', async () => {
          const art = createBundleArtifact([]);
          art.inputFile = 'src/index.tsx';

          pkg.addArtifact(art);

          await pkg.build({});

          expect(pkg.packageJson).toEqual(
            expect.objectContaining({
              files: ['src/**/*.{ts,tsx,json}'],
            }),
          );
        });
      });
    });

    describe('exports', () => {
      it('does nothing if no builds', async () => {
        pkg.addArtifact(new TestArtifact(pkg, []));

        await pkg.build({});

        expect(pkg.packageJson.exports).toBeUndefined();
      });

      it('does nothing if `addExports` is false', async () => {
        pkg.addArtifact(new TestArtifact(pkg, []));

        await pkg.build({ addExports: false });

        expect(pkg.packageJson.exports).toBeUndefined();
      });

      it('adds exports for a single artifact and format', async () => {
        pkg.addArtifact(
          createBundleArtifact([{ format: 'lib', platform: 'node', support: 'stable' }]),
        );

        await pkg.build({ addExports: true });

        expect(pkg.packageJson.exports).toEqual({
          '.': { node: './lib/index.js' },
          './package.json': './package.json',
        });
      });

      it('adds exports for a single artifact and multiple format', async () => {
        pkg.addArtifact(
          createBundleArtifact([
            { format: 'lib', platform: 'node', support: 'stable' },
            { format: 'mjs', platform: 'node', support: 'stable' },
            { format: 'cjs', platform: 'node', support: 'stable' },
          ]),
        );

        await pkg.build({ addExports: true });

        expect(pkg.packageJson.exports).toEqual({
          '.': {
            node: {
              import: './mjs/index.mjs',
              require: './cjs/index.cjs',
              default: './lib/index.js',
            },
          },
          './package.json': './package.json',
        });
      });

      it('adds exports for multiple artifacts of the same output name', async () => {
        const a = createBundleArtifact([{ format: 'lib', platform: 'node', support: 'stable' }]);
        a.sharedLib = true;
        pkg.addArtifact(a);

        const b = createBundleArtifact([{ format: 'lib', platform: 'browser', support: 'stable' }]);
        b.sharedLib = true;
        b.platform = 'browser';
        pkg.addArtifact(b);

        const c = createBundleArtifact([{ format: 'lib', platform: 'native', support: 'stable' }]);
        c.sharedLib = true;
        c.platform = 'native';
        pkg.addArtifact(c);

        await pkg.build({ addExports: true });

        expect(pkg.packageJson.exports).toEqual({
          '.': {
            node: './lib/node/index.js',
            browser: './lib/browser/index.js',
            'react-native': './lib/native/index.js',
          },
          './package.json': './package.json',
        });
      });

      it('adds exports for multiple artifacts + formats of the same output name', async () => {
        const a = createBundleArtifact([
          { format: 'lib', platform: 'node', support: 'stable' },
          { format: 'mjs', platform: 'node', support: 'stable' },
          { format: 'cjs', platform: 'node', support: 'stable' },
        ]);
        pkg.addArtifact(a);

        const b = createBundleArtifact([
          { format: 'lib', platform: 'browser', support: 'stable' },
          { format: 'esm', platform: 'browser', support: 'stable' },
          { format: 'umd', platform: 'browser', support: 'stable' },
        ]);
        b.platform = 'browser';
        pkg.addArtifact(b);

        await pkg.build({ addExports: true });

        expect(pkg.packageJson.exports).toEqual({
          '.': {
            node: {
              import: './mjs/index.mjs',
              require: './cjs/index.cjs',
              default: './lib/index.js',
            },
            browser: {
              import: './esm/index.js',
              module: './esm/index.js',
              default: './lib/index.js',
            },
          },
          './package.json': './package.json',
        });
      });

      it('adds exports for multiple artifacts of different output names', async () => {
        const a = createBundleArtifact([{ format: 'lib', platform: 'node', support: 'stable' }]);
        pkg.addArtifact(a);

        const b = createBundleArtifact([{ format: 'lib', platform: 'browser', support: 'stable' }]);
        b.platform = 'browser';
        b.outputName = 'client';
        pkg.addArtifact(b);

        await pkg.build({ addExports: true });

        expect(pkg.packageJson.exports).toEqual({
          '.': { node: './lib/index.js' },
          './client': { browser: './lib/client.js' },
          './package.json': './package.json',
        });
      });

      it('adds exports for multiple artifacts + formats of different output names', async () => {
        const a = createBundleArtifact([
          { format: 'lib', platform: 'node', support: 'stable' },
          { format: 'mjs', platform: 'node', support: 'stable' },
          { format: 'cjs', platform: 'node', support: 'stable' },
        ]);
        pkg.addArtifact(a);

        const b = createBundleArtifact([
          { format: 'lib', platform: 'browser', support: 'stable' },
          { format: 'esm', platform: 'browser', support: 'stable' },
          { format: 'umd', platform: 'browser', support: 'stable' },
        ]);
        b.platform = 'browser';
        b.outputName = 'client';
        pkg.addArtifact(b);

        await pkg.build({ addExports: true });

        expect(pkg.packageJson.exports).toEqual({
          '.': {
            node: {
              import: './mjs/index.mjs',
              require: './cjs/index.cjs',
              default: './lib/index.js',
            },
          },
          './client': {
            browser: {
              import: './esm/client.js',
              module: './esm/client.js',
              default: './lib/client.js',
            },
          },
          './package.json': './package.json',
        });
      });

      it('adds exports for bundle and types artifacts in parallel', async () => {
        pkg.addArtifact(
          createBundleArtifact([{ format: 'lib', platform: 'node', support: 'stable' }]),
        );
        pkg.addArtifact(createTypesArtifact([{ inputFile: '', outputName: 'index' }]));

        await pkg.build({ addExports: true });

        expect(pkg.packageJson.exports).toEqual({
          '.': { node: './lib/index.js', types: './dts/index.d.ts' },
          './package.json': './package.json',
        });
      });
    });
  });

  describe('cleanup()', () => {
    it('calls `cleanup` on each artifact', async () => {
      const [a, b, c] = createTestArtifacts();
      const aSpy = jest.spyOn(a, 'cleanup');
      const bSpy = jest.spyOn(b, 'cleanup');
      const cSpy = jest.spyOn(c, 'cleanup');

      pkg.addArtifact(a);
      pkg.addArtifact(b);
      pkg.addArtifact(c);

      await pkg.cleanup();

      expect(aSpy).toHaveBeenCalled();
      expect(bSpy).toHaveBeenCalled();
      expect(cSpy).toHaveBeenCalled();
    });
  });

  describe('getName()', () => {
    it('returns `name` from `package.json`', () => {
      expect(pkg.getName()).toBe('flag-common');
    });
  });

  describe('getSlug()', () => {
    it('returns package folder name', () => {
      expect(pkg.getSlug()).toBe('common');
    });
  });

  describe('getFeatureFlags()', () => {
    it('inherits workspaces from root project', () => {
      project.workspaces = ['packages/*'];

      expect(pkg.getFeatureFlags()).toEqual({ workspaces: ['packages/*'] });
    });

    it('returns true if a package dependency from workspace root', () => {
      expect(
        loadPackage(
          'common',
          new Project(getFixturePath('workspaces-feature-flags-root')),
        ).getFeatureFlags(),
      ).toEqual({
        decorators: false,
        flow: true,
        react: true,
        strict: true,
        typescript: true,
        workspaces: [],
      });
    });

    describe('react', () => {
      it('returns true if a package dependency (normal)', () => {
        expect(loadPackage('react').getFeatureFlags()).toEqual({ react: true, workspaces: [] });
      });
    });

    describe('typescript', () => {
      it('returns true if a package dependency (peer)', () => {
        expect(loadPackage('ts').getFeatureFlags()).toEqual({
          decorators: false,
          strict: false,
          typescript: true,
          workspaces: [],
        });
      });

      it('returns true if package contains a `tsconfig.json`', () => {
        expect(loadPackage('ts-config').getFeatureFlags()).toEqual({
          decorators: true,
          strict: true,
          typescript: true,
          workspaces: [],
        });
      });

      it('extracts decorators and strict support from local `tsconfig.json`', () => {
        expect(loadPackage('ts-config').getFeatureFlags()).toEqual({
          decorators: true,
          strict: true,
          typescript: true,
          workspaces: [],
        });
      });
    });

    describe('flow', () => {
      it('returns true if a package dependency (dev)', () => {
        expect(loadPackage('flow').getFeatureFlags()).toEqual({ flow: true, workspaces: [] });
      });
    });
  });

  describe('isComplete()', () => {
    it('returns true if every artifact is complete', () => {
      const [a, b, c] = createTestArtifacts();

      pkg.addArtifact(a);
      pkg.addArtifact(b);
      pkg.addArtifact(c);

      a.state = 'passed';
      b.state = 'passed';
      c.state = 'failed';

      expect(pkg.isComplete()).toBe(true);
    });

    it('returns false if any artifact is not complete', () => {
      const [a, b, c] = createTestArtifacts();

      pkg.addArtifact(a);
      pkg.addArtifact(b);
      pkg.addArtifact(c);

      a.state = 'passed';
      b.state = 'passed';
      c.state = 'pending';

      expect(pkg.isComplete()).toBe(false);
    });
  });

  describe('isRunning()', () => {
    it('returns true if any artifact is running', () => {
      const [a, b, c] = createTestArtifacts();

      pkg.addArtifact(a);
      pkg.addArtifact(b);
      pkg.addArtifact(c);

      a.state = 'passed';
      b.state = 'passed';
      c.state = 'building';

      expect(pkg.isRunning()).toBe(true);
    });

    it('returns false if all artifacts are not running', () => {
      const [a, b, c] = createTestArtifacts();

      pkg.addArtifact(a);
      pkg.addArtifact(b);
      pkg.addArtifact(c);

      a.state = 'passed';
      b.state = 'passed';
      c.state = 'passed';

      expect(pkg.isRunning()).toBe(false);
    });
  });

  describe('setConfigs()', () => {
    it('sets default formats for `browser` platform', () => {
      pkg.setConfigs([
        {
          format: [],
          inputs: {},
          platform: 'browser',
          namespace: '',
          support: 'stable',
        },
      ]);

      expect(pkg.configs).toEqual([
        {
          bundle: true,
          formats: ['lib', 'esm'],
          inputs: {},
          platform: 'browser',
          namespace: '',
          support: 'stable',
        },
      ]);
    });

    it('adds `umd` default format when `namespace` is provided for `browser` platform', () => {
      pkg.setConfigs([
        {
          format: [],
          inputs: {},
          platform: 'browser',
          namespace: 'test',
          support: 'stable',
        },
      ]);

      expect(pkg.configs).toEqual([
        {
          bundle: true,
          formats: ['lib', 'esm', 'umd'],
          inputs: {},
          platform: 'browser',
          namespace: 'test',
          support: 'stable',
        },
      ]);
    });

    it('sets default formats for `native` platform', () => {
      pkg.setConfigs([
        {
          format: [],
          inputs: {},
          platform: 'native',
          namespace: '',
          support: 'stable',
        },
      ]);

      expect(pkg.configs).toEqual([
        {
          bundle: true,
          formats: ['lib'],
          inputs: {},
          platform: 'native',
          namespace: '',
          support: 'stable',
        },
      ]);
    });

    it('sets default formats for `node` platform', () => {
      pkg.setConfigs([
        {
          format: [],
          inputs: {},
          platform: 'node',
          namespace: '',
          support: 'stable',
        },
      ]);

      expect(pkg.configs).toEqual([
        {
          bundle: false,
          formats: ['lib'],
          inputs: {},
          platform: 'node',
          namespace: '',
          support: 'stable',
        },
      ]);
    });

    it('doesnt set default formats when supplied manually', () => {
      pkg.setConfigs([
        {
          format: ['cjs', 'mjs'],
          inputs: {},
          platform: 'node',
          namespace: '',
          support: 'stable',
        },
      ]);

      expect(pkg.configs).toEqual([
        {
          bundle: false,
          formats: ['cjs', 'mjs'],
          inputs: {},
          platform: 'node',
          namespace: '',
          support: 'stable',
        },
      ]);
    });

    it('sets default formats for multiple platforms', () => {
      pkg.setConfigs([
        {
          inputs: {},
          platform: ['browser', 'node'],
        },
      ]);

      expect(pkg.configs).toEqual([
        {
          bundle: true,
          formats: ['lib', 'esm'],
          inputs: {},
          platform: 'browser',
          namespace: '',
          support: 'stable',
        },
        {
          bundle: false,
          formats: ['lib'],
          inputs: {},
          platform: 'node',
          namespace: '',
          support: 'stable',
        },
      ]);
    });

    it('filters and divides formats for multiple platforms', () => {
      pkg.setConfigs([
        {
          format: ['lib', 'esm', 'cjs'],
          inputs: {},
          platform: ['browser', 'node', 'native'],
        },
      ]);

      expect(pkg.configs).toEqual([
        {
          bundle: true,
          formats: ['lib', 'esm'],
          inputs: {},
          platform: 'browser',
          namespace: '',
          support: 'stable',
        },
        {
          bundle: false,
          formats: ['lib', 'cjs'],
          inputs: {},
          platform: 'node',
          namespace: '',
          support: 'stable',
        },
        {
          bundle: true,
          formats: ['lib'],
          inputs: {},
          platform: 'native',
          namespace: '',
          support: 'stable',
        },
      ]);
    });

    it('can override `bundle` defaults', () => {
      pkg.setConfigs([
        {
          bundle: true,
          platform: 'node',
        },
        {
          bundle: false,
          platform: 'browser',
        },
      ]);

      expect(pkg.configs).toEqual([
        {
          bundle: true,
          formats: ['lib'],
          inputs: { index: 'src/index.ts' },
          platform: 'node',
          namespace: '',
          support: 'stable',
        },
        {
          bundle: false,
          formats: ['lib', 'esm'],
          inputs: { index: 'src/index.ts' },
          platform: 'browser',
          namespace: '',
          support: 'stable',
        },
      ]);
    });

    it('errors if invalid format is provided for `browser` platform', () => {
      expect(() => {
        pkg.setConfigs([
          {
            format: ['mjs'],
            platform: 'browser',
          },
        ]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if invalid format is provided for `native` platform', () => {
      expect(() => {
        pkg.setConfigs([
          {
            format: ['esm'],
            platform: 'native',
          },
        ]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if invalid format is provided for `node` platform', () => {
      expect(() => {
        pkg.setConfigs([
          {
            format: ['umd'],
            platform: 'node',
          },
        ]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if input name contains a slash', () => {
      expect(() => {
        pkg.setConfigs([
          {
            inputs: {
              'foo/bar': 'src/foo.ts',
            },
          },
        ]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if input name contains a space', () => {
      expect(() => {
        pkg.setConfigs([
          {
            inputs: {
              'foo bar': 'src/foo.ts',
            },
          },
        ]);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('syncPackageJson()', () => {
    it('writes to `package.json', async () => {
      const spy = jest.spyOn(fs, 'writeJson').mockImplementation();

      await pkg.syncPackageJson();

      expect(spy).toHaveBeenCalledWith(
        pkg.packageJsonPath.path(),
        { name: 'flag-common' },
        { spaces: 2 },
      );
    });
  });

  describe('tsconfigJson()', () => {
    it('returns undefined if no `tsconfig.json` in package', () => {
      expect(pkg.tsconfigJson).toBeUndefined();
    });

    it('returns options from `tsconfig.json` in package', () => {
      pkg = loadPackage('ts-config');

      expect(pkg.tsconfigJson).toEqual(
        expect.objectContaining({
          options: {
            configFilePath: pkg.path.append('tsconfig.json').path(),
            experimentalDecorators: true,
            lib: ['lib.esnext.d.ts'],
            strict: true,
          },
        }),
      );
    });
  });
});
