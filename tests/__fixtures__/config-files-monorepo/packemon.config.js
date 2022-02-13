module.exports = {
	babelInput(config) {
		config.plugins.push('babel-plugin-root');
	},
	babelOutput(config) {
		config.plugins.push('root-plugin');
	},
	rollupInput(config) {
		config.plugins.push({ name: 'rollup-plugin-root' });
	},
	rollupOutput(config) {
		config.plugins.push({ name: 'root-plugin' });
	},
};
