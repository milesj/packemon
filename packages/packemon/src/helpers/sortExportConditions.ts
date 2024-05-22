import type { PackageExportPaths } from '../types';

// https://nodejs.org/api/packages.html#conditional-exports
const WEIGHTS = {
	types: 10, // Types must always be first
	solid: 15,
	misc: 20,
	'node-addons': 30,
	node: 31,
	import: 40,
	require: 50,
	default: 100, // Default must be last
};

export function flattenExportConditions(paths: PackageExportPaths): PackageExportPaths | string {
	const map: PackageExportPaths = {};
	let count = 0;

	Object.entries(paths).forEach(([path, condition]) => {
		// Remove undefined and empty values
		if (!condition) {
			return;
		}

		const key = path as keyof PackageExportPaths;

		map[key] = typeof condition === 'string' ? condition : flattenExportConditions(condition);

		count += 1;
	});

	if (count === 1) {
		if (map.default) {
			return map.default;
		}

		if (map.require) {
			return map.require;
		}
	}

	return map;
}

export function sortExportConditions<T extends PackageExportPaths | string | undefined>(
	paths: T,
): T {
	if (!paths || typeof paths === 'string') {
		return paths;
	}

	const pathsList: { weight: number; key: string; value: PackageExportPaths | string }[] = [];

	Object.entries(paths).forEach(([key, value]) => {
		if (!value) {
			return;
		}

		pathsList.push({
			key,
			value: sortExportConditions(value),
			weight: key in WEIGHTS ? WEIGHTS[key as 'misc'] : WEIGHTS.misc,
		});
	});

	pathsList.sort((a, d) => {
		const diff = a.weight - d.weight;

		return diff === 0 ? a.key.localeCompare(d.key) : diff;
	});

	const map = Object.fromEntries(
		pathsList.map((path) => [
			path.key,
			typeof path.value === 'string' ? path.value : flattenExportConditions(path.value),
		]),
	) as PackageExportPaths;

	return map as T;
}
