import { PackageStructure } from '@boost/common';
import fs from 'fs';

export function getVersion(): string {
	return (
		JSON.parse(
			// @ts-expect-error Not typed for URL
			fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
		) as PackageStructure
	).version;
}
