import fs from 'fs';
import { PackageStructure } from '@boost/common';

export function getVersion(): string {
	return (
		JSON.parse(
			// @ts-expect-error Not typed for URL
			fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
		) as PackageStructure
	).version;
}
