import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { OramaSearch } from '../dist/index.js'

const config: DocsThemeConfig = {
  logo: <span>My Project</span>,
  project: {
    link: 'https://github.com/shuding/nextra-docs-template',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: 'Nextra Docs Template',
  },
  search: {
    component: <OramaSearch limitResults={10} boost={{ title: 2, content: 1, description: 1 }} />,
  }
}

export default config
