import { OutputPlugin } from 'rollup';
import { shouldKeepDynamicImport } from '../../helpers/shouldKeepDynamicImport';
import { Platform, Support } from '../../types';

export function preserveDynamicImport(platform: Platform, support: Support): OutputPlugin {
	const preserve = shouldKeepDynamicImport(platform, support);

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
