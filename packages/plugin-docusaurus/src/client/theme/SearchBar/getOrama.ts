import { create, insert } from '@orama/orama'
import {
  afterInsert as highlightAfterInsert,
  OramaWithHighlight,
  SearchResultWithHighlight,
  searchWithHighlight
} from '@orama/plugin-match-highlight'
import { INDEX_FILE } from '../../../shared.js'
import { SectionSchema } from '../../../types.js'

type SearchFunction = (term: string) => Promise<SearchResultWithHighlight>

let searchFn: SearchFunction

export async function getOrama(baseUrl: string, indexData?: any): Promise<SearchFunction> {
  if (!searchFn) {
    indexData = indexData || (await (await fetch(`${baseUrl}${INDEX_FILE}`)).json())
    const db = (await create({
      schema: {
        pageRoute: 'string',
        sectionTitle: 'string',
        sectionContent: 'string',
        type: 'string'
      },
      components: {
        afterInsert: [highlightAfterInsert]
      }
    })) as OramaWithHighlight

    await Promise.all(
      indexData.map(async (record: SectionSchema) => {
        record.pageRoute = `${baseUrl}${record.pageRoute}`
        return insert(db, record)
      })
    )

    searchFn = async (term: string) => searchWithHighlight(db, {
      term,
      properties: ['sectionTitle', 'sectionContent', 'type']
    })
  }

  return searchFn
}
