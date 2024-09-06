import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import cookieconsent from '@jop-software/astro-cookieconsent'

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.orama.com',
  vite: {
    ssr: {
      noExternal: ['nanoid']
    }
  },
  integrations: [
    starlight({
      pagefind: false,
      plugins: [],
      title: 'Orama Docs',
      description: 'Your product answer engine.',
      favicon: '/favicon.png',
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/apple-touch-icon.png'
          }
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/favicon-32x32.png'
          }
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/favicon-16x16.png'
          }
        },
        {
          tag: 'link',
          attrs: {
            rel: 'mask-icon',
            href: '/safari-pinned-tab.svg',
            color: '#3a0839'
          }
        },
        {
          tag: 'meta',
          attrs: {
            name: 'theme-color',
            content: '#000'
          }
        },
        {
          tag: 'script',
          content: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);\n
        posthog.init('phc_FckUxnRec0gteNF9WiHB9tFCejr7ISAXALOoYqaaVO3', {api_host: 'https://eu.i.posthog.com', person_profiles: 'identified_only'})`,
          attrs: {
            type: 'text/script'
            // 'data-category': 'analytics'
          }
        }
      ],
      social: {
        github: 'https://github.com/askorama/orama',
        slack: 'https://orama.to/slack',
        twitter: 'https://x.com/askorama',
        youtube: 'https://www.youtube.com/@askorama'
      },
      customCss: ['./src/tailwind.css', './src/styles/custom.css'],
      logo: {
        replacesTitle: true,
        dark: '/src/assets/logo-orama-dark.svg',
        light: '/src/assets/logo-orama-light.svg'
      },
      components: {
        Sidebar: './src/components/Sidebar.astro',
        Header: './src/components/Header.astro',
        Search: './src/components/Search.astro',
        Hero: "./src/components/Hero.astro",
        Head: './src/components/Head.astro'
      },
      sidebar: [
        {
          label: 'open-source',
          items: [
            {
              label: 'Open Source',
              collapsed: false,
              items: [
                {
                  label: 'Getting Started',
                  link: '/open-source'
                },
                {
                  label: 'Create',
                  link: '/open-source/usage/create'
                },
                {
                  label: 'Insert',
                  link: '/open-source/usage/insert'
                },
                {
                  label: 'Remove',
                  link: '/open-source/usage/remove'
                },
                {
                  label: 'Update',
                  link: '/open-source/usage/update'
                },
                {
                  label: 'Utilities',
                  link: '/open-source/usage/utilities'
                },
                {
                  label: 'Search',
                  collapsed: true,
                  items: [
                    {
                      label: 'Searching with Orama',
                      link: '/open-source/usage/search/introduction'
                    },
                    {
                      label: 'Vector Search',
                      link: '/open-source/usage/search/vector-search'
                    },
                    {
                      label: 'Hybrid Search',
                      link: '/open-source/usage/search/hybrid-search'
                    },
                    {
                      label: 'Fields Boosting',
                      link: '/open-source/usage/search/fields-boosting'
                    },
                    {
                      label: 'Custom Search Priority',
                      link: '/open-source/usage/search/custom-search-priority'
                    },
                    {
                      label: 'Facets',
                      link: '/open-source/usage/search/facets'
                    },
                    {
                      label: 'Filters',
                      link: '/open-source/usage/search/filters'
                    },
                    {
                      label: 'GeoSearch',
                      link: '/open-source/usage/search/geosearch'
                    },
                    {
                      label: 'Sorting',
                      link: '/open-source/usage/search/sorting'
                    },
                    {
                      label: 'Grouping',
                      link: '/open-source/usage/search/grouping'
                    },
                    {
                      label: 'Threshold',
                      link: '/open-source/usage/search/threshold'
                    },
                    {
                      label: 'Preflight',
                      link: '/open-source/usage/search/preflight'
                    },
                    {
                      label: 'BM25',
                      link: '/open-source/usage/search/bm25-algorithm'
                    }
                  ]
                },
                {
                  label: 'Supported languages',
                  collapsed: true,
                  items: [
                    {
                      label: 'Officially Supported Languages',
                      link: '/open-source/supported-languages'
                    },
                    {
                      label: 'Using Chinese with Orama',
                      link: '/open-source/supported-languages/using-chinese-with-orama'
                    },
                    {
                      label: 'Using Japanese with Orama',
                      link: '/open-source/supported-languages/using-japanese-with-orama'
                    }
                  ]
                },
                {
                  label: 'TypeScript',
                  link: '/open-source/usage/typescript'
                }
              ]
            },
            {
              label: 'Internals',
              collapsed: true,
              items: [
                {
                  label: 'Components',
                  link: '/open-source/internals/components'
                },
                {
                  label: 'Utilities',
                  link: '/open-source/internals/utilities'
                }
              ]
            },
            {
              label: 'Plugins',
              collapsed: true,
              items: [
                {
                  label: 'Introduction',
                  link: '/open-source/plugins/introduction'
                },
                {
                  label: 'Writing your own plugins',
                  link: '/open-source/plugins/writing-your-own-plugins'
                },
                {
                  label: 'Plugin Vitepress',
                  link: '/open-source/plugins/plugin-vitepress'
                },
                {
                  label: 'Plugin Docusaurus',
                  link: '/open-source/plugins/plugin-docusaurus'
                },
                {
                  label: 'Plugin Secure Proxy',
                  link: '/open-source/plugins/plugin-secure-proxy'
                },
                {
                  label: 'Plugin Analytics',
                  link: '/open-source/plugins/plugin-analytics'
                },
                {
                  label: 'Plugin Astro',
                  link: '/open-source/plugins/plugin-astro'
                },
                {
                  label: 'Plugin Data Persistence',
                  link: '/open-source/plugins/plugin-data-persistence'
                },
                {
                  label: 'Plugin Match Highlight',
                  link: '/open-source/plugins/plugin-match-highlight'
                },
                {
                  label: 'Plugin Parsedoc',
                  link: '/open-source/plugins/plugin-parsedoc'
                },
                {
                  label: 'Plugin Nextra',
                  link: '/open-source/plugins/plugin-nextra'
                }
              ]
            },
            {
              label: 'Text Analysis',
              collapsed: true,
              items: [
                {
                  label: 'Stemming',
                  link: '/open-source/text-analysis/stemming'
                },
                {
                  label: 'Stopwords',
                  link: '/open-source/text-analysis/stopwords'
                }
              ]
            }
          ]
        },
        {
          label: 'cloud',
          items: [
            {
              label: 'Getting Started',
              collapsed: false,
              items: [
                {
                  label: 'Introduction',
                  link: '/cloud'
                },
                {
                  label: "What's new?",
                  link: '/cloud/whats-new'
                },
                {
                  label: "Glossary",
                  link: '/cloud/glossary'
                }
              ]
            },
            {
              label: 'Importing Data',
              collapsed: false,
              items: [
                {
                  label: 'Introduction',
                  link: '/cloud/data-sources/introduction-to-data-sources'
                },
                {
                  label: 'Create a new index',
                  link: '/cloud/working-with-indexes/create-a-new-index'
                },
                {
                  label: 'Edit an index',
                  link: '/cloud/working-with-indexes/edit-an-index'
                },
                {
                  label: 'Delete an index',
                  link: '/cloud/working-with-indexes/delete-an-index'
                }
              ]
            },
            {
              label: 'Search Engine',
              collapsed: true,
              items: [
                {
                  label: 'Full-text search',
                  link: '/cloud/performing-search/full-text-search'
                },
                {
                  label: 'Vector search',
                  link: '/cloud/performing-search/vector-search'
                },
                {
                  label: 'Hybrid search',
                  link: '/cloud/performing-search/hybrid-search'
                }
              ]
            },
            {
              label: 'Answer Engine',
              collapsed: true,
              items: [
                {
                  label: 'Introduction',
                  link: '/cloud/answer-engine/introduction'
                },
                {
                  label: 'Creating an Answer Session',
                  link: '/cloud/answer-engine/creating-an-answer-session'
                }
              ]
            },
            {
              label: 'Audience Management',
              collapsed: true,
              items: [
                {
                  label: 'Introduction',
                  link: '/cloud/audience-management/introduction'
                },
                {
                  label: 'User Segmentation',
                  link: '/cloud/audience-management/user-segmentation'
                },
                {
                  label: 'Triggers',
                  link: '/cloud/audience-management/triggers'
                }
              ]
            },
            {
              label: 'UI Components',
              collapsed: true,
              items: [
                {
                  label: 'Design System',
                  link: '#',
                }
              ]
            },
            {
              label: 'Integrating Orama Cloud',
              collapsed: false,
              items: [
                {
                  label: 'Introduction',
                  link: '/cloud/integrating-orama-cloud/official-sdk'
                },
                {
                  label: 'JavaScript SDK',
                  link: '/cloud/integrating-orama-cloud/javascript-sdk'
                },
                {
                  label: 'React SDK',
                  link: '/cloud/integrating-orama-cloud/react-sdk'
                },
                {
                  label: 'Vue SDK',
                  link: '/cloud/integrating-orama-cloud/vue-sdk'
                },
              ]
            },
            {
              label: 'Orama AI',
              collapsed: true,
              items: [
                {
                  label: 'Embeddings Generation',
                  link: '/cloud/orama-ai/automatic-embeddings-generation'
                },
                {
                  label: 'Secure Proxy',
                  link: '/cloud/orama-ai/orama-secure-proxy'
                }
              ]
            },
            {
              label: 'Understanding Orama',
              collapsed: true,
              items: [
                {
                  label: 'What is Orama Cloud?',
                  link: '/cloud/understanding-orama/orama-cloud'
                },
                {
                  label: 'What is an index?',
                  link: '/cloud/understanding-orama/indexes'
                }
              ]
            },
            {
              label: 'Open Source',
              collapsed: true,
              items: [
                {
                  label: 'Documentation',
                  link: '/open-source'
                },
                {
                  label: 'Github repository',
                  link: 'https://github.com/askorama/orama'
                }
              ]
            }
          ]
        }
      ],
      editLink: {
        baseUrl: 'https://github.com/askorama/orama/edit/main/packages/docs'
      }
    }),
    react(),
    tailwind({
      applyBaseStyles: false
    }),
    cookieconsent({
      guiOptions: {
        consentModal: {
          layout: 'box',
          position: 'bottom right',
          equalWeightButtons: true,
          flipButtons: false
        },
        preferencesModal: {
          layout: 'box',
          position: 'right',
          equalWeightButtons: true,
          flipButtons: false
        }
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true
        },
        analytics: {
          enabled: true
        }
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We use cookies 🍪 ',
              description:
                'We use cookies to ensure you get the best experience on our website. You can manage your preferences below.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences'
            },
            preferencesModal: {
              title: 'Manage cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Accept current selection',
              closeIconLabel: 'Close modal',
              sections: [
                {
                  title: 'Somebody said ... cookies? 🍪 ',
                  description: 'You can enable or disable different types of cookies: '
                },
                {
                  title: 'Strictly Necessary cookies',
                  description:
                    'These cookies are essential for the proper functioning of the website and cannot be disabled.',

                  //this field will generate a toggle linked to the 'necessary' category
                  linkedCategory: 'necessary'
                },
                {
                  title: 'Performance and Analytics',
                  description:
                    'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                  linkedCategory: 'analytics'
                },
                {
                  title: 'More information',
                  description:
                    'For any queries in relation to our policy on cookies and your choices, please <a href="mailto:info@orama.com">contact us</a>'
                }
              ]
            }
          }
        }
      }
    })
  ]
})
