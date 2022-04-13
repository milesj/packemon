import { PackageExportPaths } from '../types';

const WEIGHTS = {
	types: 10, // Types must always be first
	misc: 20,
	'node-addons': 30,
	node: 31,
	import: 40,
	require: 50,
	default: 100, // Default must be last
};

export function sortExportConditions(paths: PackageExportPaths): PackageExportPaths {
	const pathsList: { weight: number; key: string; value: PackageExportPaths | string }[] = [];

	Object.entries(paths).forEach(([key, value]) => {
		pathsList.push({
			weight: key in WEIGHTS ? WEIGHTS[key as 'misc'] : WEIGHTS.misc,
			key,
			value: typeof value === 'string' ? value : sortExportConditions(value),
		});
	});

	pathsList.sort((a, d) => a.weight - d.weight);

	return Object.fromEntries(pathsList.map((path) => [path.key, path.value]));
}
