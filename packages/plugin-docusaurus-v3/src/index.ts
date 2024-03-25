import { readFileSync, writeFileSync } from 'node:fs'
import type { Plugin } from '@docusaurus/types'
import { cp } from 'node:fs/promises'
import { gzip as gzipCB } from 'node:zlib'
import { promisify } from 'node:util'
import { resolve } from 'node:path'
// @ts-ignore
import { presets } from '@orama/searchbox'
import { create, insertMultiple, save } from '@orama/orama'
import { JSDOM } from 'jsdom'
import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'
import { LoadedContent, type LoadedVersion } from '@docusaurus/plugin-content-docs'

type PluginOptions = {
  analytics?: {
    enabled: boolean
    apiKey: string
    indexId: string
  }
}

export default function OramaPluginDocusaurus(ctx: { siteDir: any; generatedFilesDir: any }, options: PluginOptions): Plugin {
  let versions: any[] = []

  return {
    name: '@orama/plugin-docusaurus-v3',

    getThemePath() {
      return '../lib/theme'
    },

    getTypeScriptThemePath() {
      return '../src/theme'
    },

    getClientModules() {
      return ['../lib/theme/SearchBar/index.css']
    },

    async contentLoaded({ actions, allContent }) {
      const isDevelopment = process.env.NODE_ENV === 'development'
      const pluginContentDocsIds = Object.keys(allContent['docusaurus-plugin-content-docs'] ?? {})
      const loadedVersions = (allContent['docusaurus-plugin-content-docs']?.[pluginContentDocsIds[0]] as LoadedContent)?.loadedVersions
      versions = loadedVersions.map((v) => v.versionName)

      await Promise.all(
        versions.map((version) => buildDevSearchData(ctx.siteDir, ctx.generatedFilesDir, allContent, version, pluginContentDocsIds))
      )

      if (isDevelopment) {
        actions.setGlobalData({
          pluginContentDocsIds,
          analytics: options.analytics,
          searchData: Object.fromEntries(
            await Promise.all(
              versions.map(async (version) => {
                return [version, readFileSync(indexPath(ctx.generatedFilesDir, version))]
              })
            )
          )
        })
      } else {
        actions.setGlobalData({ pluginContentDocsIds, searchData: {} })
      }
    },

    async postBuild({ outDir }) {
      await Promise.all(
        versions.map(async (version) => {
          return cp(indexPath(ctx.generatedFilesDir, version), indexPath(outDir, version))
        })
      )
    }
  }
}

async function buildDevSearchData(siteDir: string, generatedFilesDir: string, allContent: any, version: string, pluginContentDocsIds: string[]) {
  const blogs: any[] = []
  const pages: any[] = []
  const docs: any[] = []
  pluginContentDocsIds.forEach((key) => {
    const loadedVersion = allContent['docusaurus-plugin-content-docs']?.[key]?.loadedVersions?.find(
      (v: LoadedVersion) => v.versionName === version
    )
    blogs.push(...(allContent['docusaurus-plugin-content-blog']?.[key]?.blogPosts?.map(({ metadata }: any) => metadata) ?? []))
    pages.push(...(allContent['docusaurus-plugin-content-pages']?.[key] ?? []))
    docs.push(...(loadedVersion?.docs ?? []))
  })

  const oramaDocs = [
    ...(await Promise.all(blogs.map((data: any) => generateDocs(siteDir, data)))),
    ...(await Promise.all(pages.map((data: any) => generateDocs(siteDir, data)))),
    ...(await Promise.all(docs.map((data: any) => generateDocs(siteDir, data))))
  ]
    .flat()
    .map((data) => ({
      title: data.title,
      content: data.content,
      section: data.originalTitle,
      path: data.path,
      category: ''
    }))

  const db = await create({
    schema: presets.docs.schema
  })

  await insertMultiple(db, oramaDocs as any)

  const serializedOrama = JSON.stringify(await save(db))
  const gzipedOrama = await gzip(serializedOrama)

  writeFileSync(indexPath(generatedFilesDir, version), gzipedOrama)
}

async function generateDocs(siteDir: string, { title, permalink, source }: Record<string, string>) {
  const fileContent = readFileSync(source.replace('@site', siteDir), 'utf-8')
  const contentWithoutFrontMatter = matter(fileContent).content

  return parseHTMLContent({
    originalTitle: title,
    html: new MarkdownIt().render(contentWithoutFrontMatter),
    path: permalink
  })
}

function parseHTMLContent({ html, path, originalTitle }: { html: any; path: any; originalTitle: any }) {
  const dom = new JSDOM(html)
  const document = dom.window.document

  const sections: { originalTitle: any; title: string; header: string; content: string; path: any }[] = []

  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headers.forEach((header) => {
    const sectionTitle = header.textContent?.trim()
    const headerTag = header.tagName.toLowerCase()
    let sectionContent = ''

    let sibling = header.nextElementSibling
    while (sibling && !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(sibling.tagName)) {
      sectionContent += sibling.textContent?.trim() + '\n'
      sibling = sibling.nextElementSibling
    }

    sections.push({
      originalTitle,
      title: sectionTitle ?? '',
      header: headerTag,
      content: sectionContent,
      path
    })
  })

  return sections
}

function indexPath(outDir: string, version: string) {
  return resolve(outDir, 'orama-search-index-@VERSION@.json.gz'.replace('@VERSION@', version))
}

const gzip = promisify(gzipCB)
