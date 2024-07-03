import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import starlightImageZoom from "starlight-image-zoom";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.askorama.ai",
  vite: {
    ssr: {
      noExternal: ['nanoid']
    }
  },
  integrations: [
    starlight({
      pagefind: false,
      plugins: [starlightImageZoom()],
      title: "Orama",
      description: "Your product answer engine.",
      favicon: "/favicon.png",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: "/apple-touch-icon.png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            href: "/favicon-32x32.png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            href: "/favicon-16x16.png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "mask-icon",
            href: "/safari-pinned-tab.svg",
            color: "#3a0839",
          },
        },
        {
          tag: "meta",
          attrs: { name: "theme-color", content: "#000" },
        },
        {
          tag: "script",
          attrs: {
            async: "",
            src: "https://www.googletagmanager.com/gtag/js?id=G-V30F6HTKBF",
          },
        },
        {
          tag: "script",
          content: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-V30F6HTKBF');`,
        },
      ],
      social: {
        github: "https://github.com/askorama/orama",
        slack: "https://orama.to/slack",
        twitter: "https://twitter.com/askorama",
      },
      customCss: ["./src/tailwind.css", "./src/styles/custom.css"],
      logo: {
        replacesTitle: true,
        dark: "/src/assets/logo-orama-dark.svg",
        light: "/src/assets/logo-orama-light.svg",
      },
      components: {
        Sidebar: "./src/components/Sidebar.astro",
        Hero: "./src/components/Hero.astro",
        Header: "./src/components/Header.astro",
        Search: "./src/components/Search.astro",
      },
      sidebar: [
        {
          label: "open-source",
          items: [
            {
              label: "Usage",
              collapsed: false,
              items: [
                { label: "Getting Started", link: "/open-source" },
                { label: "Create", link: "/open-source/usage/create.html" },
                { label: "Insert", link: "/open-source/usage/insert.html" },
                { label: "Remove", link: "/open-source/usage/remove.html" },
                { label: "Update", link: "/open-source/usage/update.html" },
                {
                  label: "Utilities",
                  link: "/open-source/usage/utilities.html",
                },
                {
                  label: "Search",
                  collapsed: true,
                  items: [
                    {
                      label: "Searching with Orama",
                      link: "/open-source/usage/search/introduction.html",
                    },
                    {
                      label: "Vector Search",
                      link: "/open-source/usage/search/vector-search.html",
                    },
                    {
                      label: "Hybrid Search",
                      link: "/open-source/usage/search/hybrid-search.html",
                    },
                    {
                      label: "Fields Boosting",
                      link: "/open-source/usage/search/fields-boosting.html",
                    },
                    {
                      label: "Custom Search Priority",
                      link: "/open-source/usage/search/custom-search-priority.html",
                    },
                    {
                      label: "Facets",
                      link: "/open-source/usage/search/facets.html",
                    },
                    {
                      label: "Filters",
                      link: "/open-source/usage/search/filters.html",
                    },
                    {
                      label: "GeoSearch",
                      link: "/open-source/usage/search/geosearch.html",
                    },
                    {
                      label: "Sorting",
                      link: "/open-source/usage/search/sorting.html",
                    },
                    {
                      label: "Grouping",
                      link: "/open-source/usage/search/grouping.html",
                    },
                    {
                      label: "Threshold",
                      link: "/open-source/usage/search/threshold.html",
                    },
                    {
                      label: "Preflight",
                      link: "/open-source/usage/search/preflight.html",
                    },
                    {
                      label: "BM25",
                      link: "/open-source/usage/search/bm25-algorithm.html",
                    },
                  ],
                },
                {
                  label: "Supported languages",
                  collapsed: true,
                  items: [
                    {
                      label: "Officially Supported Languages",
                      link: "/open-source/supported-languages",
                    },
                    {
                      label: "Using Chinese with Orama",
                      link: "/open-source/supported-languages/using-chinese-with-orama.html",
                    },
                    {
                      label: "Using Japanese with Orama",
                      link: "/open-source/supported-languages/using-japanese-with-orama.html",
                    },
                  ],
                },
                {
                  label: "TypeScript",
                  link: "/open-source/usage/typescript.html",
                },
              ],
            },
            {
              label: "Internals",
              collapsed: true,
              items: [
                {
                  label: "Components",
                  link: "/open-source/internals/components.html",
                },
                {
                  label: "Utilities",
                  link: "/open-source/internals/utilities.html",
                },
              ],
            },
            {
              label: "Plugins",
              collapsed: true,
              items: [
                {
                  label: "Introduction",
                  link: "/open-source/plugins/introduction.html",
                },
                {
                  label: "Writing your own plugins",
                  link: "/open-source/plugins/writing-your-own-plugins.html",
                },
                {
                  label: "Plugin Vitepress",
                  link: "/open-source/plugins/plugin-vitepress.html",
                },
                {
                  label: "Plugin Docusaurus",
                  link: "/open-source/plugins/plugin-docusaurus.html",
                },
                {
                  label: "Plugin Secure Proxy",
                  link: "/open-source/plugins/plugin-secure-proxy.html",
                },
                {
                  label: "Plugin Analytics",
                  link: "/open-source/plugins/plugin-analytics.html",
                },
                {
                  label: "Plugin Astro",
                  link: "/open-source/plugins/plugin-astro.html",
                },
                {
                  label: "Plugin Data Persistence",
                  link: "/open-source/plugins/plugin-data-persistence.html",
                },
                {
                  label: "Plugin Match Highlight",
                  link: "/open-source/plugins/plugin-match-highlight.html",
                },
                {
                  label: "Plugin Parsedoc",
                  link: "/open-source/plugins/plugin-parsedoc.html",
                },
                {
                  label: "Plugin Nextra",
                  link: "/open-source/plugins/plugin-nextra.html",
                },
              ],
            },
            {
              label: "Text Analysis",
              collapsed: true,
              items: [
                {
                  label: "Stemming",
                  link: "/open-source/text-analysis/stemming.html",
                },
                {
                  label: "Stopwords",
                  link: "/open-source/text-analysis/stopwords.html",
                },
              ],
            },
          ],
        },
        {
          label: "cloud",
          items: [
            {
              label: "Orama Cloud",
              link: "/cloud",
            },
            {
              label: "Understanding Orama",
              collapsed: false,
              items: [
                {
                  label: "Introduction",
                  link: "/cloud/understanding-orama/introduction.html",
                  badge: {
                    text: 'Start here!',
                    variant: 'tip'
                  }
                },
                {
                  label: "Indexes",
                  link: "/cloud/understanding-orama/indexes.html",
                },
              ],
            },
            {
              label: "Working with indexes",
              collapsed: true,
              items: [
                {
                  label: "Create a new index",
                  link: "/cloud/working-with-indexes/create-a-new-index.html",
                },
                {
                  label: "Edit an index",
                  link: "/cloud/working-with-indexes/edit-an-index.html",
                },
                {
                  label: "Delete an index",
                  link: "/cloud/working-with-indexes/delete-an-index.html",
                },
              ],
            },
            {
              label: "Data Sources",
              collapsed: true,
              items: [
                {
                  label: "Introduction to data sources",
                  link: "/cloud/data-sources/introduction-to-data-sources",
                },
                {
                  label: "Native Integrations",
                  collapsed: true,
                  items: [
                    {
                      label: "Introduction",
                      link: "/cloud/data-sources/native-integrations/introduction.html",
                    },
                    {
                      label: "Shopify",
                      link: "/cloud/data-sources/native-integrations/shopify.html",
                    },
                    {
                      label: "ElasticPath",
                      link: "/cloud/data-sources/native-integrations/elasticpath.html",
                    },
                    {
                      label: "Docusaurus",
                      link: "/cloud/data-sources/native-integrations/docusaurus.html",
                    },
                  ],
                },
                {
                  label: "Custom Integrations",
                  collapsed: true,
                  items: [
                    {
                      label: "Introduction",
                      link: "/cloud/data-sources/custom-integrations/introduction.html",
                    },
                    {
                      label: "REST API",
                      link: "/cloud/data-sources/custom-integrations/rest-api.html",
                    },
                    {
                      label: "Webhook",
                      link: "/cloud/data-sources/custom-integrations/webhooks.html",
                    },
                    {
                      label: "JSON File",
                      link: "/cloud/data-sources/custom-integrations/json-file.html",
                    },
                    {
                      label: "CSV File",
                      link: "/cloud/data-sources/custom-integrations/csv-file.html",
                    },
                  ],
                },
              ],
            },
            {
              label: "Orama AI",
              collapsed: true,
              items: [
                {
                  label: "Automatic embeddings generation",
                  link: "/cloud/orama-ai/automatic-embeddings-generation.html",
                },
                {
                  label: "Orama Secure Proxy",
                  link: "/cloud/orama-ai/orama-secure-proxy.html",
                },
              ],
            },
            {
              label: "Answer Engine",
              collapsed: true,
              badge: {
                text: "New!",
                variant: "success"
              },
              items: [
                {
                  label: "Introduction",
                  link: "/cloud/answer-engine/introduction.html",
                },
                {
                  label: "Creating an Answer Session",
                  link: "/cloud/answer-engine/creating-an-answer-session.html",
                },
              ],
            },
            {
              label: "Performing search",
              collapsed: true,
              items: [
                {
                  label: "Full-text search",
                  link: "/cloud/performing-search/full-text-search.html",
                },
                {
                  label: "Vector search",
                  link: "/cloud/performing-search/vector-search.html",
                },
                {
                  label: "Hybrid search",
                  link: "/cloud/performing-search/hybrid-search.html",
                },
                {
                  label: "Custom Search Priority",
                  link: "/cloud/performing-search/custom-search-priority.html",
                },
              ],
            },
            {
              label: "Integrating Orama Cloud",
              collapsed: true,
              items: [
                {
                  label: "JavaScript SDK",
                  link: "/cloud/integrating-orama-cloud/javascript-sdk.html",
                },
                {
                  label: "React SDK",
                  link: "/cloud/integrating-orama-cloud/react-sdk.html",
                },
                {
                  label: "Vue SDK",
                  link: "/cloud/integrating-orama-cloud/vue-sdk.html",
                },
              ],
            },
          ],
        },
      ],
      editLink: {
        baseUrl: "https://github.com/askorama/orama/edit/main/packages/docs",
      },
    }),

    react(),
    tailwind({ applyBaseStyles: false }),
  ],
});
