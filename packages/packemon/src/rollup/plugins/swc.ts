import type { OutputPlugin, Plugin } from 'rollup';
import { type Options, transform } from '@swc/core';

export function swcInput(config: Partial<Options>): Plugin {
	return {
		name: 'packemon-swc-input',

		async transform(code, filename) {
			return transform(code, {
				...config,
				filename,
				sourceMaps: true,
			});
		},
	};
}

export function swcOutput(config: Partial<Options>): OutputPlugin {
	return {
		name: 'packemon-swc-output',

		async renderChunk(code) {
			return transform(code, {
				...config,
				sourceMaps: true,
			});
		},
	};
}
