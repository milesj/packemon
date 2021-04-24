import fs from 'fs';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { BundleArtifact, Package, Project } from '../src';
import { createSnapshotSpies } from './helpers';

const root = new Path(getFixturePath('project-rollup'));

describe('Outputs', () => {
  const snapshots = createSnapshotSpies(root);

  it('builds all the artifacts with rollup', async () => {
    const project = new Project(root);
    const pkg = new Package(
      project,
      root,
      JSON.parse(fs.readFileSync(root.append('package.json').path(), 'utf8')),
    );

    const index = new BundleArtifact(pkg, [{ format: 'lib', platform: 'node', support: 'stable' }]);
    index.platform = 'node';
    index.support = 'stable';
    index.outputName = 'index';
    index.inputFile = 'src/index.ts';

    pkg.addArtifact(index);

    const client = new BundleArtifact(pkg, [
      { format: 'lib', platform: 'browser', support: 'legacy' },
      { format: 'esm', platform: 'browser', support: 'stable' },
      { format: 'umd', platform: 'browser', support: 'experimental' },
    ]);
    client.platform = 'browser';
    client.outputName = 'client';
    client.inputFile = 'src/client/index.ts';
    client.namespace = 'Packemon';

    pkg.addArtifact(client);

    const server = new BundleArtifact(pkg, [
      { format: 'cjs', platform: 'node', support: 'current' },
    ]);
    server.platform = 'node';
    server.support = 'current';
    server.outputName = 'server';
    server.inputFile = 'src/server/core.ts';

    pkg.addArtifact(server);

    const test = new BundleArtifact(pkg, [
      { format: 'lib', platform: 'native', support: 'experimental' },
    ]);
    test.platform = 'native';
    test.support = 'experimental';
    test.outputName = 'test';
    test.inputFile = 'src/test-utils/base.ts';

    pkg.addArtifact(test);

    try {
      await pkg.build({});
    } catch (error: unknown) {
      console.log(error);
    }

    snapshots
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach((ss) => {
        expect(ss).toMatchSnapshot();
      });

    expect(index.builds).toMatchSnapshot();
  });
});
