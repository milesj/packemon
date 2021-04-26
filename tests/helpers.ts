import fs from 'fs';
import fsx from 'fs-extra';
import { Path, PortablePath } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import {
  Artifact,
  BundleArtifact,
  BundleBuild,
  FORMATS,
  FORMATS_BROWSER,
  FORMATS_NATIVE,
  FORMATS_NODE,
  Package,
  PLATFORMS,
  Project,
  SUPPORTS,
} from '../src';

export function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function mockSpy(instance: unknown): jest.SpyInstance {
  return instance as jest.SpyInstance;
}

export class TestArtifact extends Artifact {
  log = this.logWithSource.bind(this);

  build() {
    return delay(50);
  }

  getBuildTargets() {
    return ['test'];
  }

  getLabel() {
    return 'test';
  }
}

export function createSnapshotSpies(root: PortablePath) {
  let snapshots: [string, unknown][] = [];

  beforeEach(() => {
    const handler = (file: unknown, content: unknown, cb?: unknown) => {
      const filePath = new Path(String(file)).path().replace(String(root), '');

      if (!filePath.endsWith('map')) {
        snapshots.push([filePath, content]);
      }

      if (typeof cb === 'function') {
        cb(null);
      }
    };

    jest.spyOn(fs, 'writeFile').mockImplementation(handler);
    jest.spyOn(fsx, 'writeJson').mockImplementation(handler);
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    snapshots = [];
  });

  return snapshots;
}

const exampleRoot = new Path(getFixturePath('examples'));
const builds = new Map<string, BundleBuild>();

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

export function testExampleOutput(file: string) {
  const snapshots = createSnapshotSpies(exampleRoot);

  test('transforms example test case', async () => {
    const project = new Project(exampleRoot);
    const pkg = new Package(
      project,
      exampleRoot,
      JSON.parse(fs.readFileSync(exampleRoot.append('package.json').path(), 'utf8')),
    );

    [...builds.values()].forEach((build) => {
      const artifact = new BundleArtifact(pkg, [build]);
      artifact.platform = build.platform;
      artifact.support = build.support;
      artifact.outputName = `index-${build.platform}-${build.support}-${build.format}`;
      artifact.inputFile = file;

      pkg.addArtifact(artifact);
    });

    try {
      await pkg.build({});
    } catch (error: unknown) {
      console.error(error);
    }

    snapshots
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach((ss) => {
        expect(ss).toMatchSnapshot();
      });
  });
}
