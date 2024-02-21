import { PackageStructure } from '@boost/common';
import { FileSystem } from '../FileSystem';

export function getVersion(fs: FileSystem): string {
	return fs.readJson<PackageStructure>(new URL('../../package.json', import.meta.url).href).version;
}
