/* eslint-disable sort-keys */

const pkg = require('../package.json');

module.exports = {
	title: 'Packemon',
	tagline:
		'Build and prepare packages for NPM distribution using standardized configurations and practices.',
	url: 'https://packemon.dev',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onDuplicateRoutes: 'throw',
	favicon: 'img/favicon.svg',
	organizationName: 'milesj',
	projectName: 'packemon',
	themeConfig: {
		algolia: { apiKey: 'd58bfe352c9b26d2fcee66851b00910b', indexName: 'packemon' },
		navbar: {
			title: 'Packemon',
			logo: {
				alt: 'Packemon',
				src: 'img/logo.svg',
			},
			items: [
				{
					label: `v${pkg.version}`,
					position: 'left',
					href: `https://www.npmjs.com/package/${pkg.name}`,
				},
				{
					to: 'docs',
					activeBasePath: 'docs',
					label: 'Docs',
					position: 'left',
				},
				{
					href: 'https://github.com/milesj/packemon',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [],
			copyright: `Copyright © ${new Date().getFullYear()} Miles Johnson. Built with <a href="https://docusaurus.io/">Docusaurus</a>. Icon by <a href="https://thenounproject.com/search/?q=pokeball&i=3548794">Gregor Cresnar</a>.`,
		},
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/milesj/packemon/edit/master/website/',
				},
				blog: {
					showReadingTime: true,
					editUrl: 'https://github.com/milesj/packemon/edit/master/website/blog/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			},
		],
	],
};
