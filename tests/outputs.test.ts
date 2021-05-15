import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { CodeArtifact } from '../src';
import { createProjectPackage, createSnapshotSpies } from './helpers';

describe('Outputs', () => {
  describe('artifacts', () => {
    const root = new Path(getFixturePath('project-rollup'));
    const snapshots = createSnapshotSpies(root);

    it('builds all the artifacts with rollup', async () => {
      const pkg = createProjectPackage(root);

      const index = new CodeArtifact(pkg, [{ format: 'lib' }]);
      index.platform = 'node';
      index.support = 'stable';
      index.inputs = { index: 'src/index.ts' };

      pkg.addArtifact(index);

      const client = new CodeArtifact(pkg, [
        { format: 'lib' },
        { format: 'esm' },
        { format: 'umd' },
      ]);
      client.platform = 'browser';
      client.support = 'legacy';
      client.inputs = { client: 'src/client/index.ts' };
      client.namespace = 'Packemon';

      pkg.addArtifact(client);

      const server = new CodeArtifact(pkg, [{ format: 'cjs' }]);
      server.platform = 'node';
      server.support = 'current';
      server.inputs = { server: 'src/server/core.ts' };

      pkg.addArtifact(server);

      const test = new CodeArtifact(pkg, [{ format: 'lib' }]);
      test.platform = 'native';
      test.support = 'experimental';
      test.inputs = { test: 'src/test-utils/base.ts' };

      pkg.addArtifact(test);

      await pkg.build({});

      snapshots(pkg).forEach((ss) => {
        expect(ss).toMatchSnapshot();
      });

      expect(index.builds).toMatchSnapshot();
    });
  });

  describe('bundle', () => {
    const root = new Path(getFixturePath('project-bundle'));
    const snapshots = createSnapshotSpies(root);

    it('bundles all files into a single file with rollup', async () => {
      const pkg = createProjectPackage(root);

      const index = new CodeArtifact(pkg, [{ format: 'lib' }]);
      index.bundle = true;
      index.platform = 'node';
      index.support = 'stable';
      index.inputs = { index: 'src/index.ts' };

      pkg.addArtifact(index);

      await pkg.build({});

      snapshots(pkg).forEach((ss) => {
        expect(ss).toMatchSnapshot();
      });
    });
  });

  describe('no bundle', () => {
    const root = new Path(getFixturePath('project-bundle'));
    const snapshots = createSnapshotSpies(root);

    it('creates individual files for every source file', async () => {
      const pkg = createProjectPackage(root);

      const index = new CodeArtifact(pkg, [{ format: 'lib' }]);
      index.bundle = false;
      index.platform = 'node';
      index.support = 'stable';
      index.inputs = { index: 'src/index.ts' };

      pkg.addArtifact(index);

      await pkg.build({});

      snapshots(pkg).forEach((ss) => {
        expect(ss).toMatchSnapshot();
      });
    });
  });
});
