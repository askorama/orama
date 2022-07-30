// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Lyra✨',
  tagline: 'Blazingly fast text search engine',
  url: 'https://github.com/nearform/lyra',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'https://nearform.github.io/lyra/imgs/lyra.svg',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nearform', // Usually your GitHub org/user name.
  projectName: 'lyra', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Lyra Logo',
          src: 'https://nearform.github.io/lyra/imgs/lyra.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction/getting-started',
            position: 'left',
            label: 'Getting Started',
          },
          {
            
            href: 'https://github.com/nearform/lyra',
            position: 'right',
            className: "header-github-link",
            "aria-label": "Lyra on GitHub",
          },
        ],
      },
      // algolia: {
      //   appId: "lyra",
      //   contextualSearch: true,
      // },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/introduction/getting-started',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/nearform/lyra',
              },
            ],
          },
        ],
        logo: {
          alt: 'Lyra Logo',
          src: 'https://nearform.github.io/lyra/imgs/lyra.svg',
        },
        copyright: `Copyright © ${new Date().getFullYear()}\n Made by NearForm with ❤️`,
      },
      colorMode: {
        defaultMode: 'dark',
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
