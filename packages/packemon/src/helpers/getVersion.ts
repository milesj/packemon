import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PackageStructure } from '@boost/common';
import type { FileSystem } from '../FileSystem';

const PKG_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../package.json');

export function getVersion(fs: FileSystem): string {
	return fs.readJson<PackageStructure>(PKG_PATH).version;
}
