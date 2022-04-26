import { PackageExports } from '../types';
import { sortExportConditions } from './sortExportConditions';

const WEIGHTS: Record<string, number> = {
	'./package.json': 0, // First
	'.': 100, // Last
};

export function sortExports(exportMap: PackageExports): PackageExports {
	const paths = Object.keys(exportMap);

	paths.sort((a, d) => {
		const diff = (WEIGHTS[a] ?? 10) - (WEIGHTS[d] ?? 10);

		return diff === 0 ? d.length - a.length : diff;
	});

	return Object.fromEntries(paths.map((path) => [path, sortExportConditions(exportMap[path])]));
}
