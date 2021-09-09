/* eslint-disable sort-keys */

module.exports = {
	docs: [
		'index',
		'install',
		'features',
		'setup',
		'config',
		'esm',
		{
			type: 'category',
			label: 'Commands',
			collapsed: false,
			items: ['build', 'clean', 'init', 'pack', 'validate', 'watch'],
		},
		'advanced',
		{
			type: 'link',
			label: 'Changelog',
			href: 'https://github.com/milesj/packemon/releases',
			// href: 'https://github.com/milesj/packemon/blob/master/CHANGELOG.md',
		},
	],
};
