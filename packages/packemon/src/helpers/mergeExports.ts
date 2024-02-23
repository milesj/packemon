/* eslint-disable no-param-reassign */

import { PackageExportConditions, PackageExportPaths } from '../types';

export function mergeExports(
	prev: PackageExportPaths | string,
	base: PackageExportPaths | string,
	root: boolean,
): PackageExportPaths | undefined {
	const next = typeof base === 'string' ? { default: base } : base;

	if (typeof prev === 'string') {
		return next;
	}

	Object.entries(next).forEach(([origKey, nextValue]) => {
		const key = origKey as PackageExportConditions;
		const prevValue = prev[key];

		if (!prevValue) {
			prev[key] = nextValue;
		} else if (nextValue) {
			prev[key] = mergeExports(prevValue, nextValue, false);
		}
	});

	// Always include a default export for tooling to work correctly
	const keys = Object.keys(prev);

	if (root && !prev.default) {
		for (const key of [
			'react-native',
			'electron',
			'browser',
			'node',
			'import',
			'require',
		] as PackageExportConditions[]) {
			if (prev[key]) {
				if (keys.length === 1) {
					return prev[key] as PackageExportPaths;
				}

				prev.default = prev[key];
				delete prev[key];

				break;
			}
		}
	}

	return prev;
}
