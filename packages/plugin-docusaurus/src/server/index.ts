import { LoadContext, Plugin } from '@docusaurus/types'
import { create } from '@orama/orama'
import { documentsStore } from '@orama/orama/components'
import { defaultHtmlSchema, NodeContent, DefaultSchemaElement, populateFromGlob } from '@orama/plugin-parsedoc'
import { writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import type { Configuration as WebpackConfiguration } from 'webpack'
import { INDEX_FILE, PLUGIN_NAME } from '../shared.js'
import { SectionSchema } from '../types.js'
import { retrieveTranslationMessages } from './translationMessages.js'

function getThemePath(): string {
  return fileURLToPath(new URL('../client/theme', import.meta.url))
}

function docusaurusOramaPlugin(docusaurusContext: LoadContext): Plugin {
  return {
    name: PLUGIN_NAME,
    // getThemePath,
    getPathsToWatch() {
      return [getThemePath(), fileURLToPath(new URL('../styles.module.css', import.meta.url))]
    },
    getDefaultCodeTranslationMessages: async () => {
      return retrieveTranslationMessages(docusaurusContext)
    },
    configureWebpack(): WebpackConfiguration {
      return {
        resolve: {
          alias: {
            'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
            'react/jsx-runtime': 'react/jsx-runtime.js'
          }
        }
      }
    },
    async contentLoaded({ actions, allContent }) {
      if (process.env.NODE_ENV !== 'development') {
        return
      }

      const index = await retrieveDevIndex(allContent)
      actions.setGlobalData(index)
    },
    async postBuild({ outDir }: { outDir: string }) {
      const index = await retrieveIndex(resolve(outDir, '**/*.html'), pageRouteFactory.bind(null, outDir))
      return writeIndex(outDir, index)
    }
  }
}

async function retrieveIndex(pattern: string, pageRouteFactory: (id: string) => string): Promise<SectionSchema[]> {
  const db = await create({ schema: defaultHtmlSchema })
  await populateFromGlob(db, pattern, { transformFn })

  return Object.values((db.data.docs as documentsStore.DocumentsStore).docs)
    .map(node => defaultToSectionSchema(node as DefaultSchemaElement, pageRouteFactory))
    .filter(isIndexable)
}

function transformFn(node: NodeContent): NodeContent {
  switch (node.tag) {
    case 'strong':
    case 'a':
    case 'time':
    case 'code':
    case 'span':
    case 'small':
    case 'b':
    case 'p':
    case 'ul':
      return { ...node, raw: `<p>${node.content}</p>` }
    default:
      return node
  }
}

function defaultToSectionSchema(node: DefaultSchemaElement, pageRouteFactory: (id: string) => string): SectionSchema {
  const { path, content, type } = node
  const pageRoute = pageRouteFactory(path)
  const sectionTitle = (pageRoute.split('/').pop() ?? '')
    .replace(/(-)+/g, ' ')
    .split(' ')
    .map(word => word && `${word[0].toUpperCase()}${word.substring(1)}`)
    .join(' ')

  return {
    pageRoute,
    sectionTitle: pageRoute ? sectionTitle : 'Home',
    sectionContent: content,
    type
  }
}

function pageRouteFactory(outDir: string, id: string): string {
  return id.replace(outDir, '').split('/').slice(1, -2).join('/')
}

function isIndexable(doc: SectionSchema): boolean {
  return (
    !!doc.sectionContent && !!doc.sectionTitle && doc.type !== 'script' && !doc.pageRoute.startsWith('/blogs/tags/')
  )
}

async function retrieveDevIndex(allContent: any): Promise<SectionSchema[]> {
  const index: SectionSchema[] = []
  const indexGenerator = ({ permalink, source }: Record<string, string>): Promise<SectionSchema[]> => {
    const pageRouteFactory = (): string => permalink.slice(1)

    return retrieveIndex(`**${source.slice(source.indexOf('/'))}`, pageRouteFactory)
  }

  const docs: Array<Record<string, string>> =
    allContent['docusaurus-plugin-content-docs']?.default?.loadedVersions[0]?.docs ?? []

  const blogs: Array<Record<string, string>> =
    allContent['docusaurus-plugin-content-blog']?.default?.blogPosts?.map(({ metadata }: any) => metadata) ?? []

  const pages: Array<Record<string, string>> = allContent['docusaurus-plugin-content-pages']?.default ?? []

  index.push(
    ...(await Promise.all(docs.map(indexGenerator))).flat(),
    ...(await Promise.all(blogs.map(indexGenerator))).flat(),
    ...(await Promise.all(pages.map(indexGenerator))).flat()
  )

  return index
}

function writeIndex(path: string, index: SectionSchema[]): Promise<void> {
  return writeFile(join(path, INDEX_FILE), JSON.stringify(index))
}

export default docusaurusOramaPlugin
