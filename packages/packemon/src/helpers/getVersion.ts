import fs from 'node:fs';
import { PackageStructure } from '@boost/common';

export function getVersion(): string {
	return (
		JSON.parse(
			fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
		) as PackageStructure
	).version;
}
