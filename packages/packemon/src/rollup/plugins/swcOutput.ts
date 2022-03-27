import { Plugin } from 'rollup';
import { Options, transform } from '@swc/core';

export function swcOutput(config: Partial<Options>): Plugin {
	return {
		name: 'swc-output',

		renderChunk(code) {
			return transform(code, config);
		},
	};
}
