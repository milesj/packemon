import { PackageExportPaths } from '../types';

const WEIGHTS = {
	types: 1, // Types must always be first
	misc: 2,
	import: 3,
	require: 4,
	default: 10, // Default must be last
};

export function sortExportConditions(paths: PackageExportPaths): PackageExportPaths {
	const pathsList: { weight: number; key: string; value: PackageExportPaths | string }[] = [];

	Object.entries(paths).forEach(([key, value]) => {
		pathsList.push({
			weight: key in WEIGHTS ? WEIGHTS[key as 'misc'] : WEIGHTS.misc,
			key,
			value,
		});
	});

	pathsList.sort((a, d) => a.weight - d.weight);

	return Object.fromEntries(pathsList.map((path) => [path.key, path.value]));
}
