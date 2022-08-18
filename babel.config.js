const plugins = [];

if (!process.env.NO_INTEROP) {
	// Needed for Jest
	plugins.push(['babel-plugin-cjs-esm-interop', { format: 'cjs' }]);
}

module.exports = {
	babelrc: true,
	babelrcRoots: ['packages/*', 'scenarios/*', 'website'],
	comments: false,
	presets: [
		[
			'moon',
			{
				decorators: true,
				react: 'automatic',
			},
		],
	],
	plugins,
};
