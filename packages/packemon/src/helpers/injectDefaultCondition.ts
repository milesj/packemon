/* eslint-disable no-param-reassign */

import { PackageExportConditions, PackageExports } from '../types';

export function injectDefaultCondition(exportMap: PackageExports) {
	Object.entries(exportMap).forEach(([path, conditions]) => {
		if (typeof conditions !== 'object') {
			return;
		}

		// Order from most to least down-leveled
		if (!conditions.default) {
			for (const key of [
				'browser',
				'react-native',
				'electron',
				'node',
				'require',
			] as PackageExportConditions[]) {
				if (conditions[key]) {
					conditions.default = conditions[key];
					delete conditions[key];
					break;
				}
			}
		}

		const keys = Object.keys(conditions);

		if (keys.length === 1) {
			exportMap[path] =
				keys[0] === 'default' ? conditions.default : conditions[keys[0] as PackageExportConditions];
		} else {
			exportMap[path] = conditions;
		}
	});
}
