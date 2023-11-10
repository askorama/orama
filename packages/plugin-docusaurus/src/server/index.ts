import type { LoadedContent, LoadedVersion } from '@docusaurus/plugin-content-docs'
import type { LoadContext, Plugin } from '@docusaurus/types'
import { create, insertMultiple, save } from '@orama/orama'
import type { DefaultSchemaElement, NodeContent, PopulateFnContext } from '@orama/plugin-parsedoc'
import { defaultHtmlSchema, populate } from '@orama/plugin-parsedoc'
import * as githubSlugger from 'github-slugger'
import { cp, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { gzip as gzipCB } from 'node:zlib'
import type { Configuration as WebpackConfiguration } from 'webpack'

import { retrieveTranslationMessages } from './translationMessages.js'
import { INDEX_FILE, PLUGIN_NAME, PluginOptions, SectionSchema, schema } from './types.js'

export type { PluginData, PluginOptions, SectionSchema } from './types.js'

const gzip = promisify(gzipCB)

function indexPath(outDir: string, version: string): string {
  return resolve(outDir, INDEX_FILE.replace('@VERSION@', version))
}

export function transformFn(node: NodeContent, context: PopulateFnContext): NodeContent {
  let raw

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
      raw = `<p>${node.content}</p>`
      break
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      context.lastLink = node.properties?.id ?? githubSlugger.slug(node.content)
      break
  }

  const transformed = {
    ...node,
    additionalProperties: {
      hash: context.lastLink
    }
  }

  if (raw) {
    transformed.raw = raw
  }

  return transformed
}

export function defaultToSectionSchema(
  node: DefaultSchemaElement,
  pageRoute: string,
  sectionTitle: string,
  version: string
): SectionSchema {
  const { content, type, properties } = node

  if (!sectionTitle) {
    sectionTitle = (pageRoute.split('/').pop() ?? '')
      .replace(/(-)+/g, ' ')
      .split(' ')
      .map(word => word && `${word[0].toUpperCase()}${word.substring(1)}`)
      .join(' ')
  }

  return {
    pageRoute,
    hash: (properties?.hash as string) ?? '',
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
  const sections = Object.values(db.data.docs.docs)
    .map(node => {
      return defaultToSectionSchema(node, permalink.slice(1), title, version)
    })
    .filter(isIndexable)

  for (const section of sections) {
    if (!section.pageRoute.startsWith('/')) {
      section.pageRoute = '/' + section.pageRoute
    }

    if (section.hash) {
      section.pageRoute += `#${section.hash}`
    }
  }

  return sections
}

async function buildDevSearchData(siteDir: string, outDir: string, allContent: any, version: string): Promise<void> {
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
  const _db = await create({
    schema
  })

  await insertMultiple(_db, documents)

  const serialized = (await save(_db))

  await writeFile(indexPath(outDir, version), await gzip(JSON.stringify(serialized)))
}

function getThemePath(): string {
  return fileURLToPath(new URL('../client/theme', import.meta.url))
}

function docusaurusOramaPlugin(context: LoadContext, options: PluginOptions): Plugin {
  let versions: string[] = []

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
      return [resolve(getThemePath(), 'SearchBar/style.css'), resolve(getThemePath(), 'SearchBarFooter/style.css')]
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
      const loadedVersions = (allContent['docusaurus-plugin-content-docs']?.default as LoadedContent)?.loadedVersions
      versions = loadedVersions.map(v => v.versionName)

      // Build all versions
      await Promise.all(
        versions.map(version => buildDevSearchData(context.siteDir, context.generatedFilesDir, allContent, version))
      )

      for (const name of versions) {
        await buildDevSearchData(context.siteDir, context.generatedFilesDir, allContent, name)
      }

      if (isDevelopment) {
        actions.setGlobalData({
          searchData: Object.fromEntries(
            await Promise.all(
              versions.map(async version => {
                return [version, await readFile(indexPath(context.generatedFilesDir, version))]
              })
            )
          )
        })
      } else {
        actions.setGlobalData({ searchData: {} })
      }
    },
    async postBuild({ outDir }: { outDir: string }) {
      await Promise.all(
        versions.map(async version => {
          return cp(indexPath(context.generatedFilesDir, version), indexPath(outDir, version))
        })
      )
    }
  }
}

export default docusaurusOramaPlugin
