import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { Path, PortablePath } from '@boost/common';
import {
	Artifact,
	FileSystem,
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
import { nodeFileSystem } from '../src/FileSystem';

const FIXTURES_DIR = path.join(
	// eslint-disable-next-line unicorn/prefer-module
	process.env.MOON_WORKSPACE_ROOT ?? path.join(__dirname, '../../..'),
	'tests',
	'__fixtures__',
);

export function createStubbedFileSystem(): FileSystem {
	return {
		copyFile: vi.fn(),
		createDirAll: vi.fn(),
		exists: vi.fn(),
		readFile: vi.fn().mockImplementation(nodeFileSystem.readFile),
		readJson: vi.fn().mockImplementation(nodeFileSystem.readJson),
		removeDir: vi.fn(),
		removeFile: vi.fn(),
		writeFile: vi.fn(),
		writeJson: vi.fn(),
	};
}

export function normalizeSeparators(part: string) {
	if (process.platform === 'win32') {
		return part.replace(/\//g, '\\');
	}

	return part.replace(/\\/g, '/');
}

export function getFixturePath(fixture: string, file: string = ''): string {
	return path.normalize(path.join(...[FIXTURES_DIR, fixture, file].map(normalizeSeparators)));
}

export const BUILDS = new Map<string, { format: Format; platform: Platform; support: Support }>();
export const BUILDS_NO_SUPPORT = new Map<string, { format: Format; platform: Platform }>();

FORMATS.forEach((format) => {
	PLATFORMS.forEach((platform) => {
		SUPPORTS.forEach((support) => {
			if (
				(platform === 'browser' && !(FORMATS_BROWSER as string[]).includes(format)) ||
				(platform === 'electron' && !(FORMATS_ELECTRON as string[]).includes(format)) ||
				(platform === 'native' && !(FORMATS_NATIVE as string[]).includes(format)) ||
				(platform === 'node' && !(FORMATS_NODE as string[]).includes(format))
			) {
				return;
			}

			BUILDS.set(`${format}:${platform}:${support}`, {
				format,
				platform,
				support,
			});

			BUILDS_NO_SUPPORT.set(`${format}:${platform}`, {
				format,
				platform,
			});
		});
	});
});

export function mockSpy(instance: unknown): MockInstance {
	return instance as MockInstance;
}

export function loadPackageAtPath(
	pkgPath: PortablePath,
	workspaceRoot?: PortablePath | null,
	fs?: FileSystem,
): Package {
	const root = Path.create(pkgPath);
	const json = nodeFileSystem.readJson<PackemonPackage>(root.append('package.json').path());

	const pkg = new Package(root, json, workspaceRoot ? Path.create(workspaceRoot) : root);

	if (fs) {
		pkg.fs = fs;
	}

	return pkg;
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

	const handler = (file: unknown, content: unknown) => {
		const filePath = formatSnapshotFilePath(String(file), String(root));

		// console.log(filePath, content);

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
	};
	// beforeEach(() => {
	// 	(fs.copyFile as unknown as MockInstance).mockImplementation(handler);
	// 	(fs.writeFile as unknown as MockInstance).mockImplementation(handler);
	// 	(fs.writeJson as unknown as MockInstance).mockImplementation(handler);

	// 	// 	vi.spyOn(console, 'warn').mockImplementation(() => {});
	// });

	afterEach(() => {
		// console.log(snapshots);
		snapshots = [];
	});

	return {
		handler,
		assert(pkg?: Package) {
			if (pkg) {
				pkg.artifacts.forEach((artifact) => {
					artifact.buildResult.files.forEach((file) => {
						snapshots.push([file.file, file.code]);
					});
				});
			}

			return snapshots.sort((a, b) => a[0].localeCompare(b[0]));
		},
	};
}

export function testExampleOutput(
	file: string,
	transformer: 'babel' | 'swc',
	options?: Partial<PackageConfig>,
	customRoot?: Path,
) {
	describe(transformer, () => {
		const root = customRoot ?? Path.create(getFixturePath('examples'));

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

		[...BUILDS.values()].forEach((build) => {
			const pkg = loadPackageAtPath(root);
			const env = `${build.platform}-${build.support}-${build.format}`;

			it(`transforms example test case: ${env}`, async () => {
				const artifact = new Artifact(pkg, [build]);
				artifact.platform = build.platform;
				artifact.support = build.support;
				artifact.inputs = { [`index-${env}`]: file };

				if (options) {
					Object.assign(artifact, options);
				}

				pkg.artifacts.push(artifact);

				try {
					await pkg.build(
						{
							addEngines: false,
							addEntries: false,
							addExports: false,
							addFiles: false,
						},
						{},
					);
				} catch (error: unknown) {
					console.error(error);
				}

				pkg.artifacts.forEach((art) => {
					art.buildResult.files.forEach((builtFile) => {
						expect(builtFile.code).toMatchSnapshot(builtFile.file);
					});
				});
			});
		});
	});
}
