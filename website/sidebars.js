/* eslint-disable sort-keys, import/no-commonjs, unicorn/prefer-module */

module.exports = {
	docs: [
		'index',
		'install',
		'setup',
		'features',
		'config',
		'swc',
		'esm',
		{
			type: 'category',
			label: 'Commands',
			collapsed: false,
			items: ['build', 'clean', 'files', 'init', 'pack', 'scaffold', 'validate', 'watch'],
		},
		'advanced',
		{
			type: 'category',
			label: 'Migration',
			items: ['migrate/2.0', 'migrate/3.0'],
		},
		{
			type: 'link',
			label: 'Changelog',
			href: 'https://github.com/milesj/packemon/releases',
		},
	],
};
