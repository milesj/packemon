/* eslint-disable sort-keys */

const path = require('node:path');

const pkg = require('../packages/packemon/package.json');

module.exports = {
	title: 'Packemon',
	tagline:
		'Scaffold, build, and maintain npm packages using standardized configurations and practices. Supports JavaScript and TypeScript.',
	url: 'https://packemon.dev',
	baseUrl: '/',
	onBrokenLinks: 'warn',
	onDuplicateRoutes: 'throw',
	favicon: 'img/favicon.svg',
	organizationName: 'milesj',
	projectName: 'packemon',
	themeConfig: {
		algolia: {
			apiKey: '1bdfdc84f4fad4dcccaaf93794d25e30',
			appId: '0O9Q3LT8SM',
			indexName: 'packemon',
		},
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
					to: 'api',
					label: 'API',
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
	plugins: [
		[
			'docusaurus-plugin-typedoc-api',
			{
				projectRoot: path.join(__dirname, '..'),
				packages: [
					'packages/babel-plugin-cjs-esm-interop',
					'packages/babel-plugin-conditional-invariant',
					'packages/babel-plugin-env-constants',
					'packages/packemon',
				],
				minimal: true,
				readmes: true,
			},
		],
	],
};
