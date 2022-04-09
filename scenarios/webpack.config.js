const path = require('path');

module.exports = {
	entry: './index.js',
	output: {
		filename: 'webpack.js',
		path: path.resolve(__dirname, 'bundles'),
	},
};
