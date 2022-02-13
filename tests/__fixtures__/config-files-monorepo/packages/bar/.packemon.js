module.exports = {
	babelInput(config) {
		config.plugins.push('babel-plugin-bar');
	},
	babelOutput(config, build) {
		config.plugins.push(['bar-plugin', build]);
	},
	rollupInput(config) {
		config.plugins.push({ name: 'rollup-plugin-bar' });
	},
	rollupOutput(config, build) {
		config.plugins.push({ name: 'bar-plugin', ...build });
	},
};
