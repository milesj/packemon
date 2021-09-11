// https://www.npmjs.com/package/eslint-config-beemo
module.exports = {
	root: true,
	extends: [
		'beemo',
		'beemo/node',
		// Uncomment when targeting browsers
		// 'beemo/browser',
		// Uncomment if using React/JSX
		// 'beemo/react',
	],
};
