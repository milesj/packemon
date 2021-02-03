/* eslint-disable no-underscore-dangle */

import fs from 'fs';
import fsx from 'fs-extra';
import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import {
  BundleArtifact,
  BundleBuild,
  FORMATS,
  FORMATS_BROWSER,
  FORMATS_NATIVE,
  FORMATS_NODE,
  PLATFORMS,
  SUPPORTS,
  Package,
  Project,
} from '../src';

const root = new Path(getFixturePath('project-rollup'));
const exampleRoot = new Path(getFixturePath('examples'));

describe('Outputs', () => {
  let snapshots: [string, unknown][] = [];

  beforeEach(() => {
    const handler = (file: unknown, content: unknown, cb?: unknown) => {
      snapshots.push([String(file).replace(root.path(), ''), content]);

      if (typeof cb === 'function') {
        cb(null);
      }
    };

    jest.spyOn(fs, 'writeFile').mockImplementation(handler);
    jest.spyOn(fsx, 'writeJson').mockImplementation(handler);
    jest.spyOn(console, 'warn').mockImplementation();

    // Required to avoid file exclusions
    // @ts-expect-error
    global.__TEST__ = true;
  });

  afterEach(() => {
    snapshots = [];
  });

  it('builds all the artifacts with rollup', async () => {
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

    const client = new BundleArtifact(pkg, [
      { format: 'lib', platform: 'browser', support: 'legacy' },
      { format: 'esm', platform: 'browser', support: 'stable' },
      { format: 'umd', platform: 'browser', support: 'experimental' },
    ]);
    client.outputName = 'client';
    client.inputFile = 'src/client/index.ts';
    client.namespace = 'Packemon';

    pkg.addArtifact(client);

    const server = new BundleArtifact(pkg, [
      { format: 'cjs', platform: 'node', support: 'current' },
    ]);
    server.outputName = 'server';
    server.inputFile = 'src/server/core.ts';

    pkg.addArtifact(server);

    const test = new BundleArtifact(pkg, [
      { format: 'lib', platform: 'native', support: 'experimental' },
    ]);
    test.outputName = 'test';
    test.inputFile = 'src/test-utils/base.ts';

    pkg.addArtifact(test);

    try {
      await pkg.build({});
    } catch (error) {
      console.log(error);
    }

    snapshots
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach((ss) => {
        expect(ss).toMatchSnapshot();
      });

    expect(index.builds).toMatchSnapshot();
  });

  const builds = new Map<string, BundleBuild>();
  const cases = {
    'node-polyfills.ts': 'Node polyfills',
  };

  FORMATS.forEach((format) => {
    PLATFORMS.forEach((platform) => {
      SUPPORTS.forEach((support) => {
        const key = `${format}:${platform}:${support}`;

        if (
          (platform === 'browser' && !(FORMATS_BROWSER as string[]).includes(format)) ||
          (platform === 'native' && !(FORMATS_NATIVE as string[]).includes(format)) ||
          (platform === 'node' && !(FORMATS_NODE as string[]).includes(format))
        ) {
          return;
        }

        builds.set(key, {
          format,
          platform,
          support,
        });
      });
    });
  });

  Object.entries(cases).forEach(([file, label]) => {
    it(`transforms for case: ${label}`, async () => {
      const project = new Project(exampleRoot);
      const pkg = new Package(
        project,
        exampleRoot,
        JSON.parse(fs.readFileSync(exampleRoot.append('package.json').path(), 'utf8')),
      );

      const artifact = new BundleArtifact(pkg, Array.from(builds.values()));
      artifact.outputName = 'index';
      artifact.inputFile = file;

      pkg.addArtifact(artifact);

      try {
        await pkg.build({});
      } catch (error) {
        console.log(error);
      }

      snapshots
        .sort((a, b) => a[0].localeCompare(b[0]))
        .forEach((ss) => {
          expect(ss).toMatchSnapshot();
        });
    });
  });
});
