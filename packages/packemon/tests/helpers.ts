import fs from 'node:fs';
import path from 'node:path';
import fsx from 'fs-extra';
import { Path, PortablePath } from '@boost/common';
import {
	Artifact,
	Format,
	FORMATS,
	FORMATS_BROWSER,
	FORMATS_ELECTRON,
	FORMATS_NATIVE,
	FORMATS_NODE,
	Package,
	PackageConfig,
	PackemonPackage,
	Platform,
	PLATFORMS,
	Support,
	SUPPORTS,
} from '../src';

const FIXTURES_DIR = path.join(
	// eslint-disable-next-line unicorn/prefer-module
	process.env.MOON_WORKSPACE_ROOT ?? path.join(__dirname, '../../..'),
	'tests',
	'__fixtures__',
);

export function normalizeSeparators(part: string) {
	if (process.platform === 'win32') {
		return part.replace(/\//g, '\\');
	}

	return part.replace(/\\/g, '/');
}

export function getFixturePath(fixture: string, file: string = ''): string {
	return path.normalize(path.join(...[FIXTURES_DIR, fixture, file].map(normalizeSeparators)));
}

const builds = new Map<string, { format: Format; platform: Platform; support: Support }>();

FORMATS.forEach((format) => {
	PLATFORMS.forEach((platform) => {
		SUPPORTS.forEach((support) => {
			const key = `${format}:${platform}:${support}`;

			if (
				(platform === 'browser' && !(FORMATS_BROWSER as string[]).includes(format)) ||
				(platform === 'electron' && !(FORMATS_ELECTRON as string[]).includes(format)) ||
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

export function mockSpy(instance: unknown): jest.SpyInstance {
	return instance as jest.SpyInstance;
}

export function loadPackageAtPath(pkgPath: PortablePath, workspaceRoot?: PortablePath): Package {
	const root = Path.create(pkgPath);
	const json = fsx.readJsonSync(root.append('package.json').path()) as PackemonPackage;

	return new Package(root, json, workspaceRoot ? Path.create(workspaceRoot) : root);
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
				filePath.endsWith('.d.ts') ||
				filePath.endsWith('.d.cts') ||
				filePath.endsWith('.d.mts') ||
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

		// eslint-disable-next-line @typescript-eslint/require-await
		const asyncHandler = async (file: unknown, content: unknown) => {
			handler(file, content);
		};

		spies.push(
			jest.spyOn(console, 'warn').mockImplementation(),
			// Rollup
			jest.spyOn(fs.promises, 'writeFile').mockImplementation(asyncHandler),
			// Packemon
			// @ts-expect-error Bad types
			jest.spyOn(fsx, 'writeJson').mockImplementation(handler),
			// Assets
			jest.spyOn(fsx, 'copyFile').mockImplementation(handler),
			jest.spyOn(fsx, 'mkdir'),
		);
	});

	afterEach(() => {
		snapshots = [];
		spies.forEach((spy) => void spy.mockRestore());
	});

	return (pkg?: Package) => {
		if (pkg) {
			pkg.artifacts.forEach((artifact) => {
				artifact.buildResult.files.forEach((file) => {
					snapshots.push([file.file, file.code]);
				});
			});
		}

		return snapshots.sort((a, b) => a[0].localeCompare(b[0]));
	};
}

export function testExampleOutput(
	file: string,
	transformer: 'babel' | 'swc',
	options?: Partial<PackageConfig>,
	customRoot?: Path,
) {
	// eslint-disable-next-line jest/valid-title
	describe(transformer, () => {
		const root = customRoot ?? getFixturePath('examples');
		const snapshots = createSnapshotSpies(root);

		beforeEach(() => {
			process.env.PACKEMON_TEST_WRITE = 'true';

			if (transformer === 'swc') {
				process.env.PACKEMON_SWC = 'true';
			}
		});

		afterEach(() => {
			delete process.env.PACKEMON_TEST_WRITE;
			delete process.env.PACKEMON_SWC;
		});

		[...builds.values()].forEach((build) => {
			const pkg = loadPackageAtPath(root);
			const env = `${build.platform}-${build.support}-${build.format}`;

			it(`transforms example test case: ${env}`, async () => {
				const artifact = new Artifact(pkg, [build]);
				artifact.platform = build.platform;
				artifact.support = build.support;
				artifact.inputs = { [`index-${env}`]: file };

				// eslint-disable-next-line jest/no-conditional-in-test
				if (options) {
					Object.assign(artifact, options);
				}

				pkg.artifacts.push(artifact);

				try {
					await pkg.build({}, {});
				} catch (error: unknown) {
					console.error(error);
				}

				snapshots().forEach((ss) => {
					expect(ss).toMatchSnapshot();
				});
			});
		});
	});
}
