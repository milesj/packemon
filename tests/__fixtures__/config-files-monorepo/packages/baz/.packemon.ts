import { ConfigFile } from 'packemon';

const config: ConfigFile = {
	babelInput(config) {
		config.plugins.unshift('babel-plugin-baz');
	},
	babelOutput(config, build) {
		config.plugins.unshift(['baz-plugin', build]);
	},
	rollupInput(config) {
		config.plugins.unshift({ name: 'rollup-plugin-baz' });
	},
	rollupOutput(config, build) {
		config.plugins.unshift({ name: 'baz-plugin', ...build });
	},
};

export default config;
