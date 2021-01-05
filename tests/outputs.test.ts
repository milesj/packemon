import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import fs from 'fs';
import fsx from 'fs-extra';
import { BundleArtifact } from '../src';
import Package from '../src/Package';
import Project from '../src/Project';

describe('Outputs', () => {
  let snapshots: { file: string; content: string }[] = [];

  beforeEach(() => {
    const handler = (file: unknown, content: unknown, cb?: unknown) => {
      snapshots.push({ file: String(file), content: String(content) });

      if (typeof cb === 'function') {
        cb(null);
      }
    };

    jest.spyOn(fs, 'writeFile').mockImplementation(handler);
    jest.spyOn(fsx, 'writeJson').mockImplementation(handler);
  });

  afterEach(() => {
    snapshots = [];
  });

  it.skip('builds all the artifacts with rollup', async () => {
    const root = new Path(getFixturePath('project-rollup'));
    const project = new Project(root);
    const pkg = new Package(
      project,
      root,
      JSON.parse(fs.readFileSync(root.append('package.json').path(), 'utf8')),
    );

    const index = new BundleArtifact(pkg, [{ format: 'lib', platform: 'node', support: 'stable' }]);
    index.outputName = 'index';
    index.inputFile = 'src/index.ts';

    pkg.addArtifact(index);

    // const client = new BundleArtifact(pkg, [
    //   { format: 'lib', platform: 'browser', support: 'legacy' },
    //   { format: 'esm', platform: 'browser', support: 'legacy' },
    //   { format: 'umd', platform: 'browser', support: 'experimental' },
    // ]);
    // client.outputName = 'client';
    // client.inputFile = 'src/client/index.ts';
    // client.namespace = 'Packemon';

    // pkg.addArtifact(client);

    // const server = new BundleArtifact(pkg, [
    //   { format: 'cjs', platform: 'node', support: 'current' },
    // ]);
    // server.outputName = 'server';
    // server.inputFile = 'src/server/core.ts';

    // pkg.addArtifact(server);

    // const test = new BundleArtifact(pkg, [
    //   { format: 'lib', platform: 'native', support: 'experimental' },
    // ]);
    // test.outputName = 'test';
    // test.inputFile = 'src/test-utils/base.ts';

    // pkg.addArtifact(test);

    try {
      await pkg.build({});
    } catch (error) {
      console.log(error);
    }

    snapshots
      .sort((a, b) => a.file.localeCompare(b.file))
      .forEach((ss) => {
        expect(ss.content).toMatchSnapshot();
      });

    expect(index.builds).toMatchSnapshot();
  });
});
