import { Plugin } from 'rollup';
import { Options, transform } from '@swc/core';

export function swcInput(config: Partial<Options>): Plugin {
	return {
		name: 'swc-input',

		transform(code, filename) {
			return transform(code, {
				...config,
				filename,
			});
		},
	};
}
