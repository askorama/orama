const oramaCloudMenu = [
  {
    label: 'cloud',
    items: [
      {
        label: 'Getting started',
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
            label: 'Glossary',
            link: '/cloud/glossary'
          }
        ]
      },
      {
        label: 'Importing data',
        collapsed: false,
        items: [
          {
            label: 'Data sources',
            link: '/cloud/data-sources/introduction-to-data-sources'
          },
          {
            label: 'Create a new index',
            link: '/cloud/working-with-indexes/create-a-new-index'
          },
          {
            label: 'Update an index',
            link: '/cloud/working-with-indexes/edit-an-index'
          },
          {
            label: 'Delete an index',
            link: '/cloud/working-with-indexes/delete-an-index'
          }
        ]
      },
      {
        label: 'Search engine',
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
        label: 'Answer engine',
        collapsed: true,
        items: [
          {
            label: 'Introduction',
            link: '/cloud/answer-engine/introduction'
          },
          {
            label: 'Creating an answer session',
            link: '/cloud/answer-engine/creating-an-answer-session'
          },
          {
            label: 'Providing more context',
            link: '/cloud/answer-engine/providing-additional-knowledge'
          }
        ]
      },
      {
        label: 'Audience management',
        collapsed: true,
        items: [
          {
            label: 'Introduction',
            link: '/cloud/audience-management/introduction'
          },
          {
            label: 'User segmentation',
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
            link: '/cloud/ui-components/design-system'
          },
          {
            label: 'Chat Box',
            link: '/cloud/ui-components/chat-box'
          },
          {
            label: 'Search Box',
            link: '/cloud/ui-components/search-box'
          },
          {
            label: 'Search Button',
            link: '/cloud/ui-components/search-button'
          }
        ]
      },
      {
        label: 'Integrating Orama Cloud',
        collapsed: false,
        items: [
          {
            label: 'Official SDKs',
            link: '/cloud/integrating-orama-cloud/official-sdk'
          },
          {
            label: 'Using JavaScript',
            link: '/cloud/integrating-orama-cloud/javascript-sdk'
          },
          {
            label: 'Using React',
            link: '/cloud/integrating-orama-cloud/react-sdk'
          },
          {
            label: 'Using Vue',
            link: '/cloud/integrating-orama-cloud/vue-sdk'
          }
        ]
      },
      {
        label: 'Orama AI',
        collapsed: true,
        items: [
          {
            label: 'Embeddings generation',
            link: '/cloud/orama-ai/automatic-embeddings-generation'
          },
          {
            label: 'Secure proxy',
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
]

export default oramaCloudMenu
