import { defineConfig } from "vitepress";
import { OramaPlugin } from "@orama/plugin-vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "Orama Docs",
  description: "Search, everywhere",
  lastUpdated: true,

  cleanUrls: true,

  head: [
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
    ],
    [
      "link",
      { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#3a0839" },
    ],
    ["meta", { name: "theme-color", content: "#000" }],
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-V30F6HTKBF",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-V30F6HTKBF');`,
    ],
  ],

  sitemap: {
    hostname: "https://docs.oramasearch.com",
  },

  vite: {
    // @ts-ignore
    plugins: [
      OramaPlugin({
        analytics: {
          enabled: true,
          apiKey: "RyOLWQiirzaGlsGuAcspAQ2YneslhTZo",
          indexId: "gjhul99bf9wnpook7nbwezg7",
        },
      }),
    ],
  },

  rewrites: {
    "/open-source": "/open-source/index",
    "/cloud": "/cloud/index",
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      dark: "/logo-orama-dark.svg",
      light: "/logo-orama-light.svg",
    },

    siteTitle: false,

    editLink: {
      pattern:
        "https://github.com/oramasearch/orama/edit/main/packages/docs/:path",
      text: "Edit this page on GitHub",
    },

    nav: [
      { text: "Open Source", link: "/open-source/index.html" },
      { text: "Orama Cloud", link: "/cloud/index.html" },
    ],

    sidebar: {
      "/open-source/": [
        {
          text: "Usage",
          collapsed: false,
          items: [
            { text: "Getting Started", link: "/open-source/index.html" },
            { text: "Create", link: "/open-source/usage/create.html" },
            { text: "Insert", link: "/open-source/usage/insert.html" },
            { text: "Remove", link: "/open-source/usage/remove.html" },
            { text: "Update", link: "/open-source/usage/update.html" },
            { text: "Utilities", link: "/open-source/usage/utilities.html" },
            {
              text: "Search",
              collapsed: true,
              items: [
                {
                  text: "Searching with Orama",
                  link: "/open-source/usage/search/introduction.html",
                },
                {
                  text: "Vector Search",
                  link: "/open-source/usage/search/vector-search.html",
                },
                {
                  text: "Hybrid Search",
                  link: "/open-source/usage/search/hybrid-search.html",
                },
                {
                  text: "Fields Boosting",
                  link: "/open-source/usage/search/fields-boosting.html",
                },
                {
                  text: "Custom Search Priority",
                  link: "/open-source/usage/search/custom-search-priority.html",
                },
                {
                  text: "Facets",
                  link: "/open-source/usage/search/facets.html",
                },
                {
                  text: "Filters",
                  link: "/open-source/usage/search/filters.html",
                },
                {
                  text: "GeoSearch",
                  link: "/open-source/usage/search/geosearch.html",
                },
                {
                  text: "Sorting",
                  link: "/open-source/usage/search/sorting.html",
                },
                {
                  text: "Grouping",
                  link: "/open-source/usage/search/grouping.html",
                },
                {
                  text: "Threshold",
                  link: "/open-source/usage/search/threshold.html",
                },
                {
                  text: "Preflight",
                  link: "/open-source/usage/search/preflight.html",
                },
                {
                  text: "BM25",
                  link: "/open-source/usage/search/bm25-algorithm.html",
                },
              ],
            },
            {
              text: "Supported languages",
              collapsed: true,
              items: [
                {
                  text: "Officially Supported Languages",
                  link: "/open-source/supported-languages/index.html",
                },
                {
                  text: "Using Chinese with Orama",
                  link: "/open-source/supported-languages/using-chinese-with-orama.html",
                },
                {
                  text: "Using Japanese with Orama",
                  link: "/open-source/supported-languages/using-japanese-with-orama.html",
                },
              ],
            },
            { text: "TypeScript", link: "/open-source/usage/typescript.html" },
          ],
        },
        {
          text: "Internals",
          collapsed: true,
          items: [
            {
              text: "Components",
              link: "/open-source/internals/components.html",
            },
            {
              text: "Utilities",
              link: "/open-source/internals/utilities.html",
            },
          ],
        },
        {
          text: "Plugins",
          collapsed: true,
          items: [
            {
              text: "Introduction",
              link: "/open-source/plugins/introduction.html",
            },
            {
              text: "Writing your own plugins",
              link: "/open-source/plugins/writing-your-own-plugins.html",
            },
            {
              text: "Plugin Vitepress",
              link: "/open-source/plugins/plugin-vitepress.html",
            },
            {
              text: "Plugin Docusaurus",
              link: "/open-source/plugins/plugin-docusaurus.html",
            },
            {
              text: "Plugin Secure Proxy",
              link: "/open-source/plugins/plugin-secure-proxy.html",
            },
            {
              text: "Plugin Analytics",
              link: "/open-source/plugins/plugin-analytics.html",
            },
            {
              text: "Plugin Astro",
              link: "/open-source/plugins/plugin-astro.html",
            },
            {
              text: "Plugin Data Persistence",
              link: "/open-source/plugins/plugin-data-persistence.html",
            },
            {
              text: "Plugin Match Highlight",
              link: "/open-source/plugins/plugin-match-highlight.html",
            },
            {
              text: "Plugin Parsedoc",
              link: "/open-source/plugins/plugin-parsedoc.html",
            },
            {
              text: "Plugin Nextra",
              link: "/open-source/plugins/plugin-nextra.html",
            },
          ],
        },
        {
          text: "Text Analysis",
          collapsed: true,
          items: [
            {
              text: "Stemming",
              link: "/open-source/text-analysis/stemming.html",
            },
            {
              text: "Stopwords",
              link: "/open-source/text-analysis/stopwords.html",
            },
          ],
        },
      ],
      "/cloud/": [
        {
          text: "Understanding Orama",
          collapsed: false,
          items: [
            {
              text: "Introduction",
              link: "/cloud/understanding-orama/introduction.html",
            },
            {
              text: "Indexes",
              link: "/cloud/understanding-orama/indexes.html",
            },
          ],
        },
        {
          text: "Working with indexes",
          collapsed: true,
          items: [
            {
              text: "Create a new index",
              link: "/cloud/working-with-indexes/create-a-new-index.html",
            },
            {
              text: "Edit an index",
              link: "/cloud/working-with-indexes/edit-an-index.html",
            },
            {
              text: "Delete an index",
              link: "/cloud/working-with-indexes/delete-an-index.html",
            },
          ],
        },
        {
          text: "Data Sources",
          collapsed: false,
          items: [
            {
              text: "Introduction to data sources",
              link: "/cloud/data-sources/introduction-to-data-sources",
            },
            {
              text: "Native Integrations",
              collapsed: true,
              items: [
                {
                  text: "Introduction",
                  link: "/cloud/data-sources/native-integrations/introduction.html",
                },
                {
                  text: "Shopify",
                  link: "/cloud/data-sources/native-integrations/shopify.html",
                },
                {
                  text: "ElasticPath",
                  link: "/cloud/data-sources/native-integrations/elasticpath.html",
                },
                {
                  text: "Docusaurus",
                  link: "/cloud/data-sources/native-integrations/docusaurus.html",
                },
              ],
            },
            {
              text: "Custom Integrations",
              collapsed: true,
              items: [
                {
                  text: "Introduction",
                  link: "/cloud/data-sources/custom-integrations/introduction.html",
                },
                {
                  text: "REST API",
                  link: "/cloud/data-sources/custom-integrations/rest-api.html",
                },
                {
                  text: "Webhook",
                  link: "/cloud/data-sources/custom-integrations/webhooks.html",
                },
                {
                  text: "JSON File",
                  link: "/cloud/data-sources/custom-integrations/json-file.html",
                },
                {
                  text: "CSV File",
                  link: "/cloud/data-sources/custom-integrations/csv-file.html",
                },
              ],
            },
          ],
        },
        {
          text: "Orama AI",
          items: [
            {
              text: "Automatic embeddings generation",
              link: "/cloud/orama-ai/automatic-embeddings-generation.html",
            },
            {
              text: "Orama Secure Proxy",
              link: "/cloud/orama-ai/orama-secure-proxy.html",
            },
          ],
        },
        {
          text: "Performing search",
          collapsed: false,
          items: [
            {
              text: "Full-text search",
              link: "/cloud/performing-search/full-text-search.html",
            },
            {
              text: "Vector search",
              link: "/cloud/performing-search/vector-search.html",
            },
            {
              text: "Hybrid search",
              link: "/cloud/performing-search/hybrid-search.html",
            },
            {
              text: "Custom Search Priority",
              link: "/cloud/performing-search/custom-search-priority.html",
            },
          ],
        },
        {
          text: "Integrating Orama Cloud",
          items: [
            {
              text: "JavaScript SDK",
              items: [
                {
                  text: "Getting Started",
                  link: "/cloud/integrating-orama-cloud/javascript-sdk/index.html",
                },
                {
                  text: "API",
                  collapsed: true,
                  items: [
                    {
                      text: "Search",
                      link: "/cloud/integrating-orama-cloud/javascript-sdk/API/search.html",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/oramasearch/orama" },
      { icon: "slack", link: "https://orama.to/slack" },
      { icon: "twitter", link: "https://twitter.com/OramaSearch" },
    ],

    footer: {
      copyright: "Copyright © 2023-present OramaSearch Inc.",
    },
  },
});
