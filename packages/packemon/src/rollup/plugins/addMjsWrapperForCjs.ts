import { Plugin } from 'rollup';

export interface AddMjsWrapperOptions {
	inputs: unknown;
}

export function addMjsWrapperForCjs({ inputs }: AddMjsWrapperOptions): Plugin {
	return {
		name: 'packemon-add-mjs-wrapper-for-cjs',

		moduleParsed(info) {
			console.log(info);
		},
	};
}
