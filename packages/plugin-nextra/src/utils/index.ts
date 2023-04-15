import type { SearchResultWithHighlight } from '@orama/plugin-match-highlight'
import type { Orama } from '@orama/orama'
import { create, insertMultiple } from '@orama/orama'
import { afterInsert as highlightAfterInsertHook } from '@orama/plugin-match-highlight'

type HighlightedHits = SearchResultWithHighlight['hits']

type OramaDoc = {
  id:      string
  title:   string
  url:     string
  content: string
}

export function groupDocumentsBy(arr: HighlightedHits, key: string) {
  return arr.reduce((accumulator, currentValue) => {
    const keyValue = currentValue.document[key] as string

    if (!accumulator[keyValue]) {
      accumulator[keyValue] = []
    }

    accumulator[keyValue].push(currentValue)
    return accumulator
  }, {})
}

export async function createOramaIndex(basePath, locale): Promise<Orama> {
  const response = await fetch(`${basePath}/_next/static/chunks/nextra-data-${locale}.json`)
  const data = await response.json()

  const index = await create({
    schema: {
      id: 'string',
      title: 'string',
      url: 'string',
      content: 'string',
    },
    components: {
      afterInsert: [highlightAfterInsertHook],
      tokenizer: {
        stemming: false,
      }
    }
  })

  const paths = Object.keys(data)
  const documents: OramaDoc[] = []

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