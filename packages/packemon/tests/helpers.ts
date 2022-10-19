import fs from 'fs';
import fsx from 'fs-extra';
import { Path, PortablePath, toArray } from '@boost/common';
import { Package } from '../src/Package';
import { PackemonPackage } from '../src/types';

export function loadPackageAtPath(path: PortablePath, workspaceRoot?: PortablePath): Package {
	const root = Path.create(path);
	const json = fsx.readJsonSync(root.append('package.json').path()) as PackemonPackage;
	const pkg = new Package(root, json, workspaceRoot ? Path.create(workspaceRoot) : root);

	pkg.setConfigs(toArray(json.packemon));

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
