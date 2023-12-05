import { defineConfig } from 'vitepress'
import { OramaSearch } from '../plugins/searchbox/index.ts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: "Orama Docs",
  description: "Search, everywhere",
  lastUpdated: true,

  vite: {
    plugins: [OramaSearch()]
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      dark: '/logo-orama-dark.svg',
      light: '/logo-orama-light.svg'
    },

    siteTitle: false,

    nav: [
      { text: 'Open Source', link: '/open-source' },
      { text: 'Orama Cloud', link: '/cloud' }
    ],

    sidebar: {
      '/open-source/': [
        {
          text: 'Usage',
          collapsed: false,
          items: [
            { text: 'Getting Started', link: '/open-source.html' },
            { text: 'Create',          link: '/open-source/usage/create.html' },
            { text: 'Insert',          link: '/open-source/usage/insert.html' },
            { text: 'Remove',          link: '/open-source/usage/remove.html' },
            { text: 'Update',          link: '/open-source/usage/update.html' },
            { text: 'Utilities',       link: '/open-source/usage/utilities.html' },
            {
              text: 'Search',
              collapsed: true,
              items: [
                { text: 'Searching with Orama', link: '/open-source/usage/search/introduction.html' },
                { text: 'Vector Search',        link: '/open-source/usage/search/vector-search.html' },
                { text: 'Fields Boosting',      link: '/open-source/usage/search/fields-boosting.html' },
                { text: 'Facets',               link: '/open-source/usage/search/facets.html' },
                { text: 'Filters',              link: '/open-source/usage/search/filters.html' },
                { text: 'GeoSearch',            link: '/open-source/usage/search/geosearch.html' },
                { text: 'Sorting',              link: '/open-source/usage/search/sorting.html' },
                { text: 'Grouping',             link: '/open-source/usage/search/grouping.html' },
                { text: 'Threshold',            link: '/open-source/usage/search/threshold.html' },
                { text: 'Preflight',            link: '/open-source/usage/search/preflight.html' },
                { text: 'BM25',                 link: '/open-source/usage/search/bm25-algorithm.html' },
              ]
            },
            { text: 'TypeScript',      link: '/open-source/usage/typescript.html' },
          ]
        },
        {
          text: 'Internals',
          collapsed: true,
          items: [
            { text: 'Components', link: '/open-source/internals/components.html' },
            { text: 'Utilities',  link: '/open-source/internals/utilities.html' },
          ]
        },
        {
          text: 'Plugins',
          collapsed: true,
          items: [
            { text: 'Introduction',             link: '/open-source/plugins/introduction.html' },
            { text: 'Writing your own plugins', link: '/open-source/plugins/writing-your-own-plugins.html' },
            { text: 'Plugin Telemetry',         link: '/open-source/plugins/plugin-telemetry.html' },
            { text: 'Plugin Astro',             link: '/open-source/plugins/plugin-astro.html' },
            { text: 'Plugin Data Persistence',  link: '/open-source/plugins/plugin-data-persistence.html' },
            { text: 'Plugin Docusaurus',        link: '/open-source/plugins/plugin-docusaurus.html' },
            { text: 'Plugin Match Highlight',   link: '/open-source/plugins/plugin-match-highlight.html' },
            { text: 'Plugin Parsedoc',          link: '/open-source/plugins/plugin-parsedoc.html' },
            { text: 'Plugin Nextra',            link: '/open-source/plugins/plugin-nextra.html' },
          ]
        },
        {
          text: 'Text Analysis',
          collapsed: true,
          items: [
            { text: 'Stemming',      link: '/open-source/text-analysis/stemming.html' },
            { text: 'Stopwords',    link: '/open-source/text-analysis/stopwords.html' },
          ]
        }
      ],
      '/cloud/': [

      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/oramasearch/orama' },
      { icon: 'slack', link: 'https://orama.to/slack' },
      { icon: 'twitter', link: 'https://twitter.com/OramaSearch' }
    ],

    footer: {
      copyright: 'Copyright © 2023-present OramaSearch Inc.',
    },
  },
})
