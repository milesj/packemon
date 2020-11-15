/* eslint-disable sort-keys */

module.exports = {
  docs: [
    'index',
    'install',
    'setup',
    'config',
    {
      type: 'category',
      label: 'Commands',
      collapsed: false,
      items: ['build', 'clean', 'validate', 'watch'],
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
