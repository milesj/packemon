import { PackageExportPaths } from '../types';

// https://nodejs.org/api/packages.html#conditional-exports
const WEIGHTS = {
	types: 10, // Types must always be first
	misc: 20,
	'node-addons': 30,
	node: 31,
	import: 40,
	require: 50,
	default: 100, // Default must be last
};

export function sortExportConditions<T extends PackageExportPaths | string>(paths: T): T {
	if (typeof paths === 'string') {
		return paths;
	}

	const pathsList: { weight: number; key: string; value: PackageExportPaths | string }[] = [];

	Object.entries(paths).forEach(([key, value]) => {
		pathsList.push({
			weight: key in WEIGHTS ? WEIGHTS[key as 'misc'] : WEIGHTS.misc,
			key,
			value: sortExportConditions(value),
		});
	});

	pathsList.sort((a, d) => {
		const diff = a.weight - d.weight;

		return diff === 0 ? a.key.localeCompare(d.key) : diff;
	});

	return Object.fromEntries(pathsList.map((path) => [path.key, path.value])) as T;
}
