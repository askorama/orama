import type { LoadedContent, LoadedVersion } from '@docusaurus/plugin-content-docs'
import type { LoadContext, Plugin } from '@docusaurus/types'
import { create, insertMultiple, save } from '@orama/orama'
import { documentsStore } from '@orama/orama/components'
import { OramaWithHighlight, afterInsert as highlightAfterInsert } from '@orama/plugin-match-highlight'
import type { DefaultSchemaElement, NodeContent } from '@orama/plugin-parsedoc'
import { defaultHtmlSchema, populate } from '@orama/plugin-parsedoc'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { gzip as gzipCB } from 'node:zlib'
import type { Configuration as WebpackConfiguration } from 'webpack'
import { INDEX_FILE, PLUGIN_NAME } from '../shared.js'
import { PluginOptions, RawDataWithPositions, SectionSchema, schema } from '../types.js'
import { retrieveTranslationMessages } from './translationMessages.js'

export type { PluginData, PluginOptions, RawDataWithPositions, SectionSchema } from '../types.js'

const gzip = promisify(gzipCB)

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

function defaultToSectionSchema(
  node: DefaultSchemaElement,
  pageRoute: string,
  sectionTitle: string,
  version: string
): SectionSchema {
  const { content, type } = node

  if (!sectionTitle) {
    sectionTitle = (pageRoute.split('/').pop() ?? '')
      .replace(/(-)+/g, ' ')
      .split(' ')
      .map(word => word && `${word[0].toUpperCase()}${word.substring(1)}`)
      .join(' ')
  }

  return {
    pageRoute,
    sectionTitle: pageRoute ? sectionTitle : 'Home',
    sectionContent: content,
    type,
    version
  }
}

function isIndexable(doc: SectionSchema): boolean {
  return (
    !!doc.sectionContent && !!doc.sectionTitle && doc.type !== 'script' && !doc.pageRoute.startsWith('/blogs/tags/')
  )
}

async function generateDocument(
  siteDir: string,
  { title, version, permalink, source }: Record<string, string>
): Promise<SectionSchema[]> {
  // Parse the document
  const data = await readFile(source.replace('@site', siteDir))
  const fileType = source.split('.').at(-1)
  const db = await create({ schema: defaultHtmlSchema })
  await populate(db, data, fileType as 'html' | 'md', { transformFn })

  // Convert all the documents to a
  const sections = Object.values((db.data.docs as documentsStore.DocumentsStore).docs)
    .map(node => {
      return defaultToSectionSchema(node as DefaultSchemaElement, permalink.slice(1), title, version)
    })
    .filter(isIndexable)

  for (const section of sections) {
    if (!section.pageRoute.startsWith('/')) {
      section.pageRoute = '/' + section.pageRoute
    }
  }

  return sections
}

async function buildDevSearchData(siteDir: string, allContent: any, version: string): Promise<RawDataWithPositions> {
  const loadedVersion = allContent['docusaurus-plugin-content-docs']?.default?.loadedVersions?.find(
    (v: LoadedVersion) => v.versionName === version
  )
  const docs = loadedVersion?.docs ?? []

  const blogs: Array<Record<string, string>> =
    allContent['docusaurus-plugin-content-blog']?.default?.blogPosts?.map(({ metadata }: any) => metadata) ?? []

  const pages: Array<Record<string, string>> = allContent['docusaurus-plugin-content-pages']?.default ?? []

  const generator = generateDocument.bind(null, siteDir)

  // Gather all pages we want to index
  const documents = [
    ...(await Promise.all(docs.map(generator))),
    ...(await Promise.all(blogs.map(generator))),
    ...(await Promise.all(pages.map(generator)))
  ].flat()

  // Create the Orama database and then serialize it
  const db = (await create({
    schema,
    components: {
      afterInsert: [highlightAfterInsert]
    }
  })) as OramaWithHighlight

  await insertMultiple(db, documents)

  const serialized = (await save(db)) as RawDataWithPositions
  serialized.positions = db.data.positions

  return serialized
}

function getThemePath(): string {
  return fileURLToPath(new URL('../client/theme', import.meta.url))
}

function docusaurusOramaPlugin(context: LoadContext, options: PluginOptions): Plugin {
  const searchData: Record<string, RawDataWithPositions> = {}

  return {
    name: PLUGIN_NAME,
    getThemePath,
    getPathsToWatch() {
      return [getThemePath()]
    },
    getDefaultCodeTranslationMessages: async () => {
      return retrieveTranslationMessages(context)
    },
    getClientModules() {
      return [resolve(getThemePath(), 'SearchBar/style.css')]
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
      const isDevelopment = process.env.NODE_ENV === 'development'

      const versions = (allContent['docusaurus-plugin-content-docs']?.default as LoadedContent)?.loadedVersions.map(
        v => {
          const { versionName: name, path } = v
          return { name, path }
        }
      )

      for (const { name } of versions) {
        const index = await buildDevSearchData(context.siteDir, allContent, name)
        searchData[name] = index
      }

      actions.setGlobalData({ versions, searchData: isDevelopment ? searchData : undefined })
    },
    async postBuild({ outDir }: { outDir: string }) {
      await Promise.all(
        Object.entries(searchData).map(async ([version, index]) => {
          return writeFile(
            resolve(outDir, INDEX_FILE.replace('@VERSION@', version)),
            await gzip(JSON.stringify(index)),
            'utf-8'
          )
        })
      )
    }
  }
}

export default docusaurusOramaPlugin
