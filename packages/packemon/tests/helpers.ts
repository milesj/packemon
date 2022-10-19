import fs from 'fs-extra';
import { Path, PortablePath } from '@boost/common';
import { Package } from '../src/Package';

export function loadPackageAtPath(path: PortablePath, workspaceRoot?: PortablePath): Package {
	const root = Path.create(path);

	return new Package(
		root,
		fs.readJsonSync(root.append('package.json').path()),
		workspaceRoot ? Path.create(workspaceRoot) : root,
	);
}
