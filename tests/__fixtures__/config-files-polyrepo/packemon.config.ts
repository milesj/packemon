import { ConfigFile } from 'packemon';

const config: ConfigFile = {
	babelInput(config) {
		config.plugins.push('poly-plugin-input');
	},
	babelOutput(config, build) {
		config.plugins.unshift(['poly-plugin-output', build]);
	},
	rollupInput(config) {
		config.plugins.push({ name: 'poly-plugin-input' });
	},
	rollupOutput(config, build) {
		config.plugins.unshift({ name: 'poly-plugin-output', ...build });
	},
};

export default config;
