export default {
	module: '@beemo/dev',
	drivers: [
		'babel',
		'eslint',
		'jest',
		'prettier',
		[
			'typescript',
			{
				buildFolder: 'dts',
				declarationOnly: true,
			},
		],
	],
	settings: {
		decorators: true,
		node: true,
		react: true,
	},
};
