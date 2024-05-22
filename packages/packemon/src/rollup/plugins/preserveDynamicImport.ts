import type { OutputPlugin } from 'rollup';
import { shouldKeepDynamicImport } from '../../helpers/shouldKeepDynamicImport';
import type { Format, Platform } from '../../types';

export function preserveDynamicImport(platform: Platform, format: Format): OutputPlugin {
	const preserve = shouldKeepDynamicImport(platform, format);

	return {
		name: 'packemon-preserve-dynamic-import',

		renderDynamicImport() {
			if (preserve) {
				return {
					left: 'import(',
					right: ')',
				};
			}

			return null;
		},
	};
}
