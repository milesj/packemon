import { PackageExports } from '../types';
import { sortExportConditions } from './sortExportConditions';

export function sortExports(exportMap: PackageExports): PackageExports {
	const paths = Object.keys(exportMap);

	paths.sort((a, d) => d.localeCompare(a));

	return Object.fromEntries(paths.map((path) => [path, sortExportConditions(exportMap[path])]));
}
