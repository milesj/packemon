import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import Package from '../src/Package';
import Packemon from '../src/Packemon';

describe('Packemon', () => {
  let packemon: Packemon;

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
          support: 'stable',
        },
      ]);

      expect(two.getName()).toBe('pkg-valid-object');
      expect(two.configs).toEqual([
        {
          formats: ['lib'],
          inputs: { index: 'src/index.ts' },
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
