import type { Orama, TypedDocument } from '@orama/orama'
import { create, insertMultiple } from '@orama/orama'
import type { SearchResultWithHighlight } from '@orama/plugin-match-highlight'
import { afterInsert as highlightAfterInsertHook } from '@orama/plugin-match-highlight'

export type NextraOrama = Orama<typeof defaultSchema>

type HighlightedHits = SearchResultWithHighlight<NextraOrama>['hits']

export function groupDocumentsBy(arr: HighlightedHits, key: string) {
  return arr.reduce((acc, current) => {
    const keyValue = current.document[key] as string

    if (!acc[keyValue]) {
      acc[keyValue] = []
    }

    acc[keyValue].push(current)
    return acc
  }, {})
}

const defaultSchema = {
  id: 'string',
  title: 'string',
  url: 'string',
  content: 'string',
} as const

export async function createOramaIndex(basePath, locale): Promise<NextraOrama> {
  const response = await fetch(`${basePath}/_next/static/chunks/nextra-data-${locale}.json`)
  const data = await response.json()

  const index = await create({
    schema: defaultSchema,
    components: {
      afterInsert: [highlightAfterInsertHook],
      tokenizer: {
        stemming: false,
      },
    },
  })

  const paths = Object.keys(data)
  const documents: TypedDocument<NextraOrama>[] = []

  for (const path of paths) {
    const url = path
    const title = data[path].title
    const content = data[path].data['']

    documents.push({
      id: url,
      title,
      url,
      content,
    })

    const sectionData = data[path].data
    delete sectionData['']

    for (const sectionTitle in sectionData) {
      const [hash, title] = sectionTitle.split('#')
      const content = sectionData[sectionTitle]

      documents.push({
        id: `${url}#${hash}`,
        title,
        url: `${url}#${hash}`,
        content,
      })
    }
  }

  await insertMultiple(index, documents)

  return index
}
