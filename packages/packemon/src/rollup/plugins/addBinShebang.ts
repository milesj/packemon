/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import type { OutputPlugin } from 'rollup';

export function addBinShebang(): OutputPlugin {
	return {
		name: 'packemon-add-bin-shebang',

		generateBundle(options, bundle) {
			Object.entries(bundle).forEach(([outputPath, chunk]) => {
				if (
					(outputPath.match(/bin\.(js|cjs|mjs)$/) ||
						outputPath.includes('bin/') ||
						outputPath.includes('bins/')) &&
					chunk.type === 'chunk'
				) {
					// eslint-disable-next-line no-param-reassign
					chunk.code = `#!/usr/bin/env node\n${chunk.code}`;
				}
			});
		},
	};
}
