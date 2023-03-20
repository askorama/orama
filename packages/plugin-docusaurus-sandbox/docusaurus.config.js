module.exports = {
  title: 'Test site',
  tagline: 'Test site',
  favicon: 'img/favicon.ico',
  url: 'http://localhost:3000/',
  baseUrl: '/',
  organizationName: 'lyrasearch',
  projectName: 'plugin-docusaurus',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        blog: false,
        theme: {},
      },
    ],
  ],
  plugins: ['@orama/plugin-docusaurus'],
}
