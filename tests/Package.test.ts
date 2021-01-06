import fs from 'fs-extra';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import Package from '../src/Package';
import Project from '../src/Project';
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

      jest.spyOn(artifact, 'postBuild').mockImplementation(() => {
        throw new Error('Whoops');
      });

      pkg.addArtifact(artifact);

      expect(artifact.state).toBe('pending');
      expect(artifact.buildResult.time).toBe(0);

      try {
        await pkg.build({});
      } catch (error) {
        expect(error).toEqual(new Error('Whoops'));
      }

      expect(artifact.state).toBe('failed');
      expect(artifact.buildResult.time).not.toBe(0);
    });

    it('syncs `package.json` when done building', async () => {
      const artifact = new TestArtifact(pkg, []);
      const spy = jest.spyOn(pkg, 'syncPackageJson');

      pkg.addArtifact(artifact);

      await pkg.build({});

      expect(spy).toHaveBeenCalled();
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
          formats: ['lib', 'esm'],
          inputs: {},
          platforms: ['browser'],
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
          formats: ['lib', 'esm', 'umd'],
          inputs: {},
          platforms: ['browser'],
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
          formats: ['lib'],
          inputs: {},
          platforms: ['native'],
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
          formats: ['lib'],
          inputs: {},
          platforms: ['node'],
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
          formats: ['cjs', 'mjs'],
          inputs: {},
          platforms: ['node'],
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
