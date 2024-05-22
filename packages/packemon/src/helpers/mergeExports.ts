/* eslint-disable no-param-reassign */

import type { PackageExportConditions, PackageExportPaths } from '../types';

export function mergeExports(
	prev: PackageExportPaths | string,
	base: PackageExportPaths | string,
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
			prev[key] = mergeExports(prevValue, nextValue);
		}
	});

	return prev;
}
