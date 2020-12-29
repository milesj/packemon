import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import Packemon from '../src/Packemon';

describe('Packemon', () => {
  describe('findPackagesInProject()', () => {
    it('errors if no packages are found', async () => {
      const packemon = new Packemon(getFixturePath('workspace-private'));

      await expect(packemon.findPackagesInProject(true)).rejects.toThrowError(
        'No packages found in project.',
      );
    });

    describe('solorepo', () => {
      it('sets workspaces property to an empty list', async () => {
        const packemon = new Packemon(getFixturePath('workspace-not-configured'));

        await packemon.findPackagesInProject();

        expect(packemon.project.workspaces).toEqual([]);
      });

      it('returns project as package', async () => {
        const root = getFixturePath('workspace-not-configured');
        const packemon = new Packemon(root);
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
        const packemon = new Packemon(getFixturePath('workspaces-not-configured'));

        await packemon.findPackagesInProject();

        expect(packemon.project.workspaces).toEqual(['packages/*']);
      });

      it('returns all packages in project', async () => {
        const root = getFixturePath('workspaces-not-configured');
        const packemon = new Packemon(root);
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
        const packemon = new Packemon(root);
        const packages = await packemon.findPackagesInProject(true);

        expect(packages).toHaveLength(3);
        expect(packages.find((p) => p.package.name === 'qux')).toBeUndefined();
      });
    });
  });
});
