import fs from 'fs';
import fsx from 'fs-extra';
import { Path, PortablePath } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import {
	Artifact,
	CodeArtifact,
	Format,
	FORMATS,
	FORMATS_BROWSER,
	FORMATS_NATIVE,
	FORMATS_NODE,
	Package,
	PackageConfig,
	Platform,
	PLATFORMS,
	Project,
	Support,
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

	getPackageExports() {
		return {};
	}
}

export function createProjectPackage(root: Path, customProject?: Project): Package {
	return new Package(
		customProject ?? new Project(root),
		root,
		fsx.readJsonSync(root.append('package.json').path()),
	);
}

function formatSnapshotFilePath(file: string, root: string): string {
	return new Path(String(file))
		.path()
		.replace(String(root), '')
		.replace(/^(\/|\\)/, '')
		.replace(/\\/g, '/');
}

export function createSnapshotSpies(root: PortablePath, captureJson: boolean = false) {
	let snapshots: [string, unknown][] = [];
	const spies: jest.SpyInstance[] = [];

	beforeEach(() => {
		const handler = (file: unknown, content: unknown, cb?: unknown) => {
			const filePath = formatSnapshotFilePath(String(file), String(root));

			if (
				filePath.endsWith('.js') ||
				filePath.endsWith('.cjs') ||
				filePath.endsWith('.mjs') ||
				(captureJson && filePath.endsWith('.json'))
			) {
				snapshots.push([filePath, content]);
			}

			if (filePath.endsWith('.css')) {
				snapshots.push([filePath, formatSnapshotFilePath(String(content), String(root))]);
			}

			if (typeof cb === 'function') {
				cb(null);
			}
		};

		spies.push(
			jest.spyOn(fs, 'writeFile').mockImplementation(handler),
			jest.spyOn(fsx, 'writeJson').mockImplementation(handler),
			jest.spyOn(fsx, 'copyFile').mockImplementation(handler),
			jest.spyOn(fsx, 'mkdir'),
			jest.spyOn(console, 'warn').mockImplementation(),
		);
	});

	afterEach(() => {
		snapshots = [];
		spies.forEach((spy) => void spy.mockRestore());
	});

	return (pkg: Package) => {
		pkg.artifacts.forEach((artifact) => {
			artifact.buildResult.files.forEach((file) => {
				snapshots.push([file.file, file.code]);
			});
		});

		return snapshots.sort((a, b) => a[0].localeCompare(b[0]));
	};
}

const exampleRoot = new Path(getFixturePath('examples'));
const builds = new Map<string, { format: Format; platform: Platform; support: Support }>();

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

export function testExampleOutput(file: string, options?: Partial<PackageConfig>) {
	const snapshots = createSnapshotSpies(exampleRoot);

	[...builds.values()].forEach((build) => {
		const pkg = createProjectPackage(exampleRoot);
		const env = `${build.platform}-${build.support}-${build.format}`;

		test(`transforms example test case: ${env}`, async () => {
			const artifact = new CodeArtifact(pkg, [build]);
			artifact.platform = build.platform;
			artifact.support = build.support;
			artifact.inputs = { [`index-${env}`]: file };

			// eslint-disable-next-line jest/no-conditional-in-test
			if (options) {
				Object.assign(artifact, options);
			}

			pkg.addArtifact(artifact);

			try {
				await pkg.build({}, {});
			} catch (error: unknown) {
				console.error(error);
			}

			snapshots(pkg).forEach((ss) => {
				expect(ss).toMatchSnapshot();
			});
		});
	});
}
