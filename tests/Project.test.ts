import execa from 'execa';
import { getFixturePath } from '@boost/test-utils';
import { Package } from '../src/Package';
import { Project } from '../src/Project';
import { delay, mockSpy } from './helpers';

jest.mock('execa');

describe('Project', () => {
  describe('checkEngineVersionConstraint()', () => {
    it('errors if packemon version does not match defined engine constraint', () => {
      const project = new Project(getFixturePath('project-constraint'));

      try {
        project.checkEngineVersionConstraint();
      } catch (error) {
        expect(error.message).toContain(
          'Project requires a packemon version compatible with 0.0.0, found',
        );
      }
    });
  });

  describe('isLernaManaged()', () => {
    it('returns true if a monorepo and has lerna.json', () => {
      const project = new Project(getFixturePath('workspaces'));
      project.workspaces = ['packages/*'];

      expect(project.isLernaManaged()).toBe(true);
    });

    it('returns false if a not a monorepo but has lerna.json', () => {
      const project = new Project(getFixturePath('workspaces'));
      project.workspaces = [];

      expect(project.isLernaManaged()).toBe(false);
    });

    it('returns false if a monorepo but no lerna.json', () => {
      const project = new Project(getFixturePath('workspaces-not-configured'));
      project.workspaces = ['packages/*'];

      expect(project.isLernaManaged()).toBe(false);
    });
  });

  describe('isWorkspacesEnabled()', () => {
    it('returns true if globs are defined', () => {
      const project = new Project(getFixturePath('workspaces'));
      project.workspaces = ['packages/*'];

      expect(project.isWorkspacesEnabled()).toBe(true);
    });

    it('returns false if no globs are defined', () => {
      const project = new Project(getFixturePath('workspaces'));
      project.workspaces = [];

      expect(project.isWorkspacesEnabled()).toBe(false);
    });
  });

  describe('generateDeclarations()', () => {
    it('generates declarations with `tsc`', async () => {
      const project = new Project(getFixturePath('workspace-private'));

      await project.generateDeclarations();

      expect(execa).toHaveBeenCalledWith(
        'tsc',
        ['--declaration', '--declarationDir', 'dts', '--declarationMap', '--emitDeclarationOnly'],
        {
          cwd: project.root.path(),
          preferLocal: true,
        },
      );
    });

    it('generates declarations with `tsc --build` when using workspaces', async () => {
      const project = new Project(getFixturePath('workspaces'));
      project.workspaces = ['packages/*'];

      await project.generateDeclarations();

      expect(execa).toHaveBeenCalledWith('tsc', ['--build', '--force'], {
        cwd: project.root.path(),
        preferLocal: true,
      });
    });

    it('reuses the same promise while building', async () => {
      mockSpy(execa)
        .mockReset()
        .mockImplementation(() => delay(200));

      const project = new Project(getFixturePath('workspace-private'));

      await Promise.all([
        project.generateDeclarations(),
        project.generateDeclarations(),
        project.generateDeclarations(),
      ]);

      expect(execa).toHaveBeenCalledTimes(1);
    });
  });

  describe('getWorkspacePackageNames()', () => {
    it('returns empty array when not using workspaces', () => {
      expect(new Project(getFixturePath('workspace-private')).getWorkspacePackageNames()).toEqual(
        [],
      );
    });

    it('returns package names when using workspaces', () => {
      expect(new Project(getFixturePath('workspaces')).getWorkspacePackageNames()).toEqual([
        'pkg-invalid-config',
        'pkg-no-config',
        'pkg-valid-array',
        'pkg-valid-object',
        'pkg-valid-object-private',
      ]);
    });
  });

  describe('rootPackage()', () => {
    const project = new Project(getFixturePath('workspaces'));

    it('returns an instance of `Package`', () => {
      expect(project.rootPackage).toBeInstanceOf(Package);
    });

    it('loads `package.json` contents', () => {
      expect(project.rootPackage.packageJson).toEqual({
        private: true,
        workspaces: ['packages/*', 'other/', 'misc'],
      });
    });
  });
});
