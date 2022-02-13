import { ConfigFile } from 'packemon';

const config: ConfigFile = {
	babelInput(config) {
		config.plugins.push('babel-plugin-foo');
	},
	babelOutput(config, build) {
		config.plugins.push(['foo-plugin', build]);
	},
	rollupInput(config) {
		config.plugins.push({ name: 'rollup-plugin-foo' });
	},
	rollupOutput(config, build) {
		config.plugins.push({ name: 'foo-plugin', ...build });
	},
};

export default config;
