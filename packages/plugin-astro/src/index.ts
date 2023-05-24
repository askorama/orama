import type { Orama, Schema, SearchParams } from '@orama/orama'
import { create as createOramaDB, insert as insertIntoOramaDB, save as saveOramaDB } from '@orama/orama'
import type { AstroConfig, AstroIntegration, RouteData } from 'astro'
import { compile } from 'html-to-text'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join as joinPath } from 'node:path'

interface AstroPage {
  pathname: string
}

interface AstroConfigDoneArgs {
  config: AstroConfig
}

interface AstroBuildDoneArgs {
  pages: AstroPage[]
  routes: RouteData[]
}

export const defaultSchema: Schema = {
  path: 'string',
  title: 'string',
  h1: 'string',
  content: 'string'
}

export type PageIndexSchema = typeof defaultSchema

export interface OramaOptions {
  language: string
  /**
   * Controls whether generatedFilePath is filter
   * using case sensitive or case insensitive comparison
   * @default false
   *
   */
  caseSensitive?: boolean
  pathMatcher: RegExp
  contentSelectors?: string[]
  searchOptions?: Omit<SearchParams, 'term'> | undefined
}

const PKG_NAME = '@orama/plugin-astro'

const titleConverter = compile({
  baseElements: { selectors: ['title'] }
})
const h1Converter = compile({
  baseElements: { selectors: ['h1'] }
})

async function prepareOramaDb(
  dbConfig: OramaOptions,
  pages: AstroPage[],
  routes: RouteData[]
): Promise<Orama<{ Schema: PageIndexSchema }>> {
  const contentConverter = compile({
    baseElements: {
      selectors: dbConfig.contentSelectors?.length ? dbConfig.contentSelectors : ['body']
    }
  })

  // All routes are in the same folder, we can use the first one to get the basePath
  const basePath = routes[0].distURL?.pathname?.replace(/\/$/, '').split('dist/')[0] + 'dist/'
  const pathsToBeIndexed = pages
    .filter(({ pathname }) => dbConfig.pathMatcher.test(pathname))
    .map(({ pathname }) => {
      // Some pages like 404 are generated as 404.html while others are usually pageName/index.html
      const matchingPathname = routes.find(r => r.distURL?.pathname.endsWith(pathname.replace(/\/$/, '') + '.html'))
        ?.distURL?.pathname
      return {
        pathname,
        generatedFilePath: matchingPathname ?? `${basePath}${pathname}index.html`
      }
    })
    .filter(({ generatedFilePath }) => !!generatedFilePath)

  const oramaDB = await createOramaDB({
    schema: defaultSchema,
    ...(dbConfig.language ? { language: dbConfig.language } : undefined)
  })

  for (const { pathname, generatedFilePath } of pathsToBeIndexed) {
    const htmlContent = readFileSync(generatedFilePath, { encoding: 'utf8' })

    const title = titleConverter(htmlContent) ?? ''
    const h1 = h1Converter(htmlContent) ?? ''
    const content = contentConverter(htmlContent)

    await insertIntoOramaDB(
      oramaDB,
      {
        path: `/${pathname}`,
        title,
        h1,
        content
      },
      dbConfig.language
    )
  }

  return oramaDB
}

export function createPlugin(options: Record<string, OramaOptions>): AstroIntegration {
  let config: AstroConfig

  return {
    name: PKG_NAME,
    hooks: {
      'astro:config:done': function ({ config: cfg }: AstroConfigDoneArgs): void {
        config = cfg
      },
      'astro:build:done': async function ({ pages, routes }: AstroBuildDoneArgs): Promise<void> {
        const assetsDir = joinPath(config.outDir.pathname, 'assets')
        if (!existsSync(assetsDir)) {
          mkdirSync(assetsDir)
        }

        for (const [dbName, dbConfig] of Object.entries(options)) {
          const namedDb = await prepareOramaDb(dbConfig, pages, routes)

          writeFileSync(joinPath(assetsDir, `oramaDB_${dbName}.json`), JSON.stringify(await saveOramaDB(namedDb)), {
            encoding: 'utf8'
          })
        }
      }
    }
  }
}

export default createPlugin
