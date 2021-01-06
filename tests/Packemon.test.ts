import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { BundleArtifact } from '../src';
import Package from '../src/Package';
import Packemon from '../src/Packemon';

describe('Packemon', () => {
  let packemon: Packemon;

  it('errors with engine version constraint', () => {
    // eslint-disable-next-line jest/require-to-throw-message
    expect(() => new Packemon(getFixturePath('project-constraint'))).toThrow();
  });

  describe('findPackagesInProject()', () => {
    it('errors if no packages are found', async () => {
      packemon = new Packemon(getFixturePath('workspace-private'));

      await expect(packemon.findPackagesInProject(true)).rejects.toThrow(
        'No packages found in project.',
      );
    });

    describe('solorepo', () => {
      it('sets workspaces property to an empty list', async () => {
        packemon = new Packemon(getFixturePath('workspace-not-configured'));

        await packemon.findPackagesInProject();

        expect(packemon.project.workspaces).toEqual([]);
      });

      it('returns project as package', async () => {
        const root = getFixturePath('workspace-not-configured');
        packemon = new Packemon(root);
        const packages = await packemon.findPackagesInProject();

        expect(packages).toHaveLength(1);
        expect(packages).toEqual([
          {
            metadata: packemon.project.createWorkspaceMetadata(new Path(root, 'package.json')),
            package: { name: 'solorepo' },
          },
        ]);
      });
    });

    describe('monorepo', () => {
      it('sets workspaces property to a list of globs', async () => {
        packemon = new Packemon(getFixturePath('workspaces-not-configured'));

        await packemon.findPackagesInProject();

        expect(packemon.project.workspaces).toEqual(['packages/*']);
      });

      it('returns all packages in project', async () => {
        const root = getFixturePath('workspaces-not-configured');
        packemon = new Packemon(root);
        const packages = await packemon.findPackagesInProject();

        expect(packages).toHaveLength(4);
        expect(packages).toEqual([
          {
            metadata: packemon.project.createWorkspaceMetadata(
              new Path(root, 'packages/bar/package.json'),
            ),
            package: { name: 'bar' },
          },
          {
            metadata: packemon.project.createWorkspaceMetadata(
              new Path(root, 'packages/baz/package.json'),
            ),
            package: { name: 'baz' },
          },
          {
            metadata: packemon.project.createWorkspaceMetadata(
              new Path(root, 'packages/foo/package.json'),
            ),
            package: { name: 'foo' },
          },
          {
            metadata: packemon.project.createWorkspaceMetadata(
              new Path(root, 'packages/qux/package.json'),
            ),
            package: { name: 'qux', private: true },
          },
        ]);
      });

      it('filters private packages when `skipPrivate` is true', async () => {
        const root = getFixturePath('workspaces-not-configured');
        packemon = new Packemon(root);
        const packages = await packemon.findPackagesInProject(true);

        expect(packages).toHaveLength(3);
        expect(packages.find((pkg) => pkg.package.name === 'qux')).toBeUndefined();
      });
    });
  });

  describe('generateArtifacts()', () => {
    beforeEach(() => {
      packemon = new Packemon(getFixturePath('workspaces'));
    });

    it('generates build artifacts for each config in a package', async () => {
      const packages = await packemon.loadConfiguredPackages();

      packemon.generateArtifacts(packages);

      expect(packages[0].artifacts).toHaveLength(2);
      expect((packages[0].artifacts[0] as BundleArtifact).outputName).toBe('index');
      expect((packages[0].artifacts[0] as BundleArtifact).inputFile).toBe('src/index.ts');
      expect(packages[0].artifacts[0].builds).toEqual([
        { format: 'lib', platform: 'browser', support: 'stable' }, // Down-leveled node -> browser
      ]);

      expect((packages[0].artifacts[1] as BundleArtifact).outputName).toBe('index');
      expect((packages[0].artifacts[1] as BundleArtifact).inputFile).toBe('src/index.ts');
      expect(packages[0].artifacts[1].builds).toEqual([
        { format: 'lib', platform: 'browser', support: 'stable' }, // Down-leveled current -> stable
        { format: 'esm', platform: 'browser', support: 'current' },
      ]);

      expect(packages[1].artifacts).toHaveLength(1);
      expect((packages[1].artifacts[0] as BundleArtifact).outputName).toBe('core');
      expect((packages[1].artifacts[0] as BundleArtifact).inputFile).toBe('./src/core.ts');
      expect(packages[1].artifacts[0].builds).toEqual([
        { format: 'lib', platform: 'node', support: 'stable' },
      ]);

      expect(packages[2].artifacts).toHaveLength(1);
      expect((packages[2].artifacts[0] as BundleArtifact).outputName).toBe('index');
      expect((packages[2].artifacts[0] as BundleArtifact).inputFile).toBe('src/index.ts');
      expect(packages[2].artifacts[0].builds).toEqual([
        { format: 'lib', platform: 'browser', support: 'stable' },
        { format: 'esm', platform: 'browser', support: 'stable' },
        { format: 'umd', platform: 'browser', support: 'stable' },
      ]);
    });

    it('down-levels "lib" format when shared is required', () => {
      const pkg = new Package(packemon.project, packemon.project.root, {
        name: 'a',
        version: '0.0.0',
        packemon: {},
      });

      pkg.setConfigs([
        {
          format: 'lib',
          platform: 'browser',
          support: 'legacy',
        },
        {
          format: 'lib',
          platform: 'node',
          support: 'current',
        },
      ]);

      packemon.generateArtifacts([pkg]);

      expect(pkg.artifacts).toHaveLength(2);
      expect(pkg.artifacts[0].builds).toEqual([
        { format: 'lib', platform: 'browser', support: 'legacy' },
      ]);
      // Down-leveled
      expect(pkg.artifacts[1].builds).toEqual([
        { format: 'lib', platform: 'browser', support: 'legacy' },
      ]);
    });
  });

  describe('loadConfiguredPackages()', () => {
    beforeEach(() => {
      packemon = new Packemon(getFixturePath('workspaces'));
    });

    it('returns the same reference because of memoization', async () => {
      expect(await packemon.loadConfiguredPackages()).toBe(await packemon.loadConfiguredPackages());
    });

    it('returns all configured packages', async () => {
      const packages = await packemon.loadConfiguredPackages();

      expect(packages).toHaveLength(3);
      expect(packages.map((pkg) => pkg.getName())).toEqual([
        'pkg-valid-array',
        'pkg-valid-object',
        'pkg-valid-object-private',
      ]);
    });

    it('sets configs for each valid package', async () => {
      const [one, two, three] = await packemon.loadConfiguredPackages();

      expect(one.getName()).toBe('pkg-valid-array');
      expect(one.configs).toEqual([
        {
          formats: ['lib'],
          inputs: { index: 'src/index.ts' },
          namespace: '',
          platforms: ['node'],
          support: 'stable',
        },
        {
          formats: ['lib', 'esm'],
          inputs: { index: 'src/index.ts' },
          namespace: '',
          platforms: ['browser'],
          support: 'current',
        },
      ]);

      expect(two.getName()).toBe('pkg-valid-object');
      expect(two.configs).toEqual([
        {
          formats: ['lib'],
          inputs: { core: './src/core.ts' },
          namespace: '',
          platforms: ['node'],
          support: 'stable',
        },
      ]);

      expect(three.getName()).toBe('pkg-valid-object-private');
      expect(three.configs).toEqual([
        {
          formats: ['lib', 'esm', 'umd'],
          inputs: { index: 'src/index.ts' },
          namespace: 'Test',
          platforms: ['browser'],
          support: 'stable',
        },
      ]);
    });

    it('filters private packages when `skipPrivate` is true', async () => {
      const packages = await packemon.loadConfiguredPackages(true);

      expect(packages).toHaveLength(2);
      expect(packages.find((pkg) => pkg.getName() === 'valid-object-private')).toBeUndefined();
    });

    it('filters packages that are missing a `packemon` config', async () => {
      const packages = await packemon.loadConfiguredPackages();

      expect(packages.find((pkg) => pkg.getName() === 'no-config')).toBeUndefined();
    });

    it('filters packages where `packemon` config is invalid', async () => {
      const packages = await packemon.loadConfiguredPackages();

      expect(packages.find((pkg) => pkg.getName() === 'invalid-config')).toBeUndefined();
    });

    it('emits `onPackagesLoaded` event', async () => {
      const spy = jest.fn();

      packemon.onPackagesLoaded.listen(spy);

      await packemon.loadConfiguredPackages();

      expect(spy).toHaveBeenCalledWith([
        expect.any(Package),
        expect.any(Package),
        expect.any(Package),
      ]);
    });
  });
});
