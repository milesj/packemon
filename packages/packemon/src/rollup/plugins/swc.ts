import { Plugin } from 'rollup';
import { Options, transform } from '@swc/core';

export function swcInput(config: Partial<Options>): Plugin {
	return {
		name: 'swc-input',

		async transform(code, filename) {
			console.log('swcInput', config);

			return transform(code, {
				...config,
				filename,
			});
		},
	};
}

export function swcOutput(config: Partial<Options>): Plugin {
	return {
		name: 'swc-output',

		async renderChunk(code) {
			console.log('swcOutput', config);

			return transform(code, config);
		},
	};
}
