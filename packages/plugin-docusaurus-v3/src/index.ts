import { readFileSync, writeFileSync } from "node:fs"
import type { Plugin } from "@docusaurus/types"
import { cp } from "node:fs/promises"
import { gzip } from "pako"
import { resolve } from "node:path"
// @ts-ignore
import { presets } from "@orama/searchbox"
import { create, insertMultiple, save } from "@orama/orama"
import { JSDOM } from "jsdom"
import MarkdownIt from "markdown-it"
import matter from "gray-matter"
import { createSnapshot, deployIndex, fetchEndpointConfig } from "./utils"

type CloudConfig = {
  deploy: boolean
  endpoint: string
  indexId: string
  oramaCloudAPIKey?: string
  public_api_key: string
}

type PluginOptions = {
  analytics?: {
    enabled: boolean
    apiKey: string
    indexId: string
  }
  cloud?: CloudConfig
}

export default function OramaPluginDocusaurus(
  ctx: {
    siteDir: any
    generatedFilesDir: any
  },
  options: PluginOptions
): Plugin {
  let versions: any[] = []

  return {
    name: "@orama/plugin-docusaurus-v3",

    getThemePath() {
      return "../dist/theme"
    },

    getTypeScriptThemePath() {
      return "../src/theme"
    },

    getClientModules() {
      return ["../dist/theme/SearchBar/index.css"]
    },

    async allContentLoaded({ actions, allContent }) {
      const isDevelopment = !options.cloud?.oramaCloudAPIKey
      const docsInstances: string[] = []
      const oramaCloudAPIKey = options.cloud?.oramaCloudAPIKey
      const searchDataConfig = [
        {
          docs: allContent["docusaurus-plugin-content-docs"]
        },
        {
          blogs: allContent["docusaurus-plugin-content-blog"]
        },
        {
          pages: allContent["docusaurus-plugin-content-pages"]
        }
      ]

      const deployConfig = options.cloud && {
        enabled: options.cloud.deploy,
        oramaCloudAPIKey,
        indexId: options.cloud.indexId
      }
      const allOramaDocsPromises: Promise<any>[] = []

      searchDataConfig.forEach((config) => {
        const [key, value] = Object.entries(config)[0]
        switch (key) {
          case "docs":
            if (!value) break
            Object.keys(value).forEach((docsInstance: any) => {
              const loadedVersions = value?.[docsInstance]?.loadedVersions
              versions = loadedVersions.map((v: any) => v.versionName)
              docsInstances.push(docsInstance)
              versions.flatMap(async (version) => {
                const currentVersion = loadedVersions.find((v: any) => v.versionName === version)
                allOramaDocsPromises.push(
                  ...currentVersion.docs.map((data: any) =>
                    generateDocs({
                      siteDir: ctx.siteDir,
                      version,
                      category: docsInstance,
                      data
                    })
                  )
                )
              })
            })
            break
          case "blogs":
            Object.keys(value).forEach(async (instance) => {
              const loadedInstance = value[instance]
              allOramaDocsPromises.push(
                ...loadedInstance.blogPosts.map(({ metadata }: any) => {
                  return generateDocs({
                    siteDir: ctx.siteDir,
                    version: "current",
                    category: "blogs",
                    data: metadata
                  })
                })
              )
            })
            break
          case "pages":
            Object.keys(value).forEach(async (instance) => {
              const loadedInstance = value[instance]
              allOramaDocsPromises.push(
                ...loadedInstance.map((data: any) =>
                  generateDocs({
                    siteDir: ctx.siteDir,
                    version: "current",
                    category: "pages",
                    data
                  })
                )
              )
            })

            break
        }
      })

      const oramaDocs = (await Promise.all(allOramaDocsPromises)).flat().reduce((acc, curr) => {
        if (!!curr.title && !!curr.content) {
          acc.push({
            title: curr.title,
            content: curr.content,
            section: curr.originalTitle,
            version: curr.version,
            path: curr.path,
            category: curr.category
          })
        }

        return acc
      }, [])

      if (isDevelopment) {
        actions.setGlobalData({
          searchData: Object.fromEntries([["current", readFileSync(indexPath(ctx.generatedFilesDir, "current"))]]),
          docsInstances,
          availableVersions: versions
        })
      } else {
        const endpointConfig = await deployData({
          oramaDocs,
          generatedFilesDir: ctx.generatedFilesDir,
          version: "current",
          deployConfig
        })

        actions.setGlobalData({
          docsInstances,
          availableVersions: versions,
          analytics: options.analytics,
          endpoint: {
            url: endpointConfig?.endpoint,
            key: endpointConfig?.public_api_key
          }
        })
      }
    },

    async postBuild({ outDir }) {
      !options.cloud && (await cp(indexPath(ctx.generatedFilesDir, "current"), indexPath(outDir, "current")))
    }
  }
}

async function generateDocs({
  siteDir,
  version,
  category,
  data
}: {
  siteDir: string
  version: string
  category: string
  data: Record<string, string>
}) {
  const { title, permalink, source } = data
  const fileContent = readFileSync(source.replace("@site", siteDir), "utf-8")
  const contentWithoutFrontMatter = matter(fileContent).content

  return parseHTMLContent({
    originalTitle: title,
    version,
    category,
    html: new MarkdownIt().render(contentWithoutFrontMatter),
    path: permalink
  })
}

function parseHTMLContent({
  html,
  path,
  originalTitle,
  version,
  category
}: {
  html: any
  path: any
  originalTitle: any
  version: string
  category: string
}) {
  const dom = new JSDOM(html)
  const document = dom.window.document
  const sections: {
    originalTitle: any
    title: string
    header: string
    content: string
    version: string
    category: string
    path: any
  }[] = []

  const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
  if (!headers.length) {
    sections.push({
      originalTitle,
      title: originalTitle,
      header: "h1",
      content: html,
      version,
      category,
      path
    })
  }
  headers.forEach((header) => {
    const sectionTitle = header.textContent?.trim()
    const headerTag = header.tagName.toLowerCase()
    let sectionContent = ""

    let sibling = header.nextElementSibling
    while (sibling && !["H1", "H2", "H3", "H4", "H5", "H6"].includes(sibling.tagName)) {
      sectionContent += sibling.textContent?.trim() + "\n"
      sibling = sibling.nextElementSibling
    }

    sections.push({
      originalTitle,
      title: sectionTitle ?? "",
      header: headerTag,
      content: sectionContent,
      version,
      category,
      path
    })
  })

  return sections
}

function indexPath(outDir: string, version: string) {
  return resolve(outDir, "orama-search-index-@VERSION@.json.gz".replace("@VERSION@", version))
}

async function deployData({
  oramaDocs,
  generatedFilesDir,
  version,
  deployConfig
}: {
  oramaDocs: any[]
  generatedFilesDir: string
  version: string
  deployConfig:
    | {
    indexId: string
    enabled: boolean
    oramaCloudAPIKey: string | undefined
  }
    | undefined
}) {
  const { ORAMA_CLOUD_BASE_URL } = process.env
  const baseUrl = ORAMA_CLOUD_BASE_URL || "https://cloud.oramasearch.com"

  if (deployConfig) {
    const endpointConfig = await fetchEndpointConfig(baseUrl, deployConfig.oramaCloudAPIKey!, deployConfig.indexId!)

    await createSnapshot(baseUrl, deployConfig.oramaCloudAPIKey!, deployConfig.indexId!, oramaDocs)

    if (deployConfig.enabled) {
      await deployIndex(baseUrl, deployConfig.oramaCloudAPIKey!, deployConfig.indexId!)
    }

    return endpointConfig
  } else {
    const db = await create({
      schema: { ...presets.docs.schema, version: "enum" }
    })

    await insertMultiple(db, oramaDocs as any)

    const serializedOrama = JSON.stringify(await save(db))
    const gzipedOrama = gzip(serializedOrama)
    writeFileSync(indexPath(generatedFilesDir, version), gzipedOrama)

    return undefined
  }
}