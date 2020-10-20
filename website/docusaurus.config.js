/* eslint-disable sort-keys */

module.exports = {
  title: 'Packemon',
  tagline: "Build and prepare packages using standardized practices. Gotta pack 'em all!",
  url: 'https://packemon.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onDuplicateRoutes: 'throw',
  favicon: 'img/favicon.svg',
  organizationName: 'milesj',
  projectName: 'packemon',
  themeConfig: {
    navbar: {
      title: 'Packemon',
      logo: {
        alt: 'Packemon',
        src: 'img/logo.svg',
      },
      items: [
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
