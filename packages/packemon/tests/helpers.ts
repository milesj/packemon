import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { Path, type PortablePath } from '@boost/common';
import {
	Artifact,
	BINARY_ASSETS,
	type FileSystem,
	type Format,
	FORMATS,
	FORMATS_BROWSER,
	FORMATS_ELECTRON,
	FORMATS_NATIVE,
	FORMATS_NODE,
	Package,
	type PackageConfig,
	type PackemonPackage,
	type Platform,
	PLATFORMS,
	type Support,
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
		exists: vi.fn().mockImplementation(nodeFileSystem.exists),
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

function formatSnapshotFilePath(file: string): string {
	return file.replace(/^(\/|\\)/, '').replace(/\\/g, '/');
}

export function snapshotPackageBuildOutputs(pkg: Package) {
	pkg.artifacts.forEach((art) => {
		art.buildResult.files.forEach((chunk) => {
			if (BINARY_ASSETS.some((ext) => chunk.file.endsWith(ext)) || chunk.file.endsWith('.map')) {
				return;
			}

			expect(chunk.code).toMatchSnapshot(formatSnapshotFilePath(chunk.file));
		});
	});
}

export function testExampleOutput(
	file: string,
	transformer: 'babel' | 'swc',
	options?: Partial<PackageConfig>,
	customRoot?: Path,
) {
	describe(transformer, () => {
		const root = customRoot ?? Path.create(getFixturePath('examples'));

		vi.spyOn(console, 'warn').mockImplementation(() => {});

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

		[...BUILDS.values()].some((build) => {
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

				snapshotPackageBuildOutputs(pkg);
			});

			return false;
		});
	});
}
