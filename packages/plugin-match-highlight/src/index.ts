import { Document, Language, Orama, Result, Results, Schema, search, SearchParams } from '@orama/orama'

export interface Position {
  start: number
  length: number
}

export type OramaWithHighlight = Orama & {
  data: { positions: Record<string, Record<string, Record<string, Position[]>>> }
}

export type SearchResultWithHighlight = Results & {
  hits: (Result & { positions: Position[] })[]
}

export async function afterInsert(orama: Orama | OramaWithHighlight, id: string): Promise<void> {
  if (!('positions' in orama.data)) {
    Object.assign(orama.data, { positions: {} })
  }

  await recursivePositionInsertion(
    orama as OramaWithHighlight,
    (await orama.documentsStore.get(orama.data.docs, id))!,
    id
  )
}

const wordRegEx = /[\p{L}0-9_'-]+/gimu

async function recursivePositionInsertion(
  orama: OramaWithHighlight,
  doc: Document,
  id: string,
  prefix = '',
  schema: Schema = orama.schema
): Promise<void> {
  orama.data.positions[id] = Object.create(null)
  for (const key of Object.keys(doc)) {
    const isNested = typeof doc[key] === 'object'
    const isSchemaNested = typeof schema[key] === 'object'
    const propName = `${prefix}${key}`
    if (isNested && key in schema && isSchemaNested) {
      recursivePositionInsertion(orama, doc[key] as Document, id, propName + '.', schema[key] as Schema)
    }
    if (!(typeof doc[key] === 'string' && key in schema && !isSchemaNested)) {
      continue
    }
    orama.data.positions[id][propName] = Object.create(null)
    const text = doc[key] as string
    let regExResult
    while ((regExResult = wordRegEx.exec(text)) !== null) {
      const word = regExResult[0].toLowerCase()
      const key = `${orama.tokenizer.language}:${word}`
      let token: string
      if (orama.tokenizer.normalizationCache.has(key)) {
        token = orama.tokenizer.normalizationCache.get(key)!
        /* c8 ignore next 4 */
      } else {
        ;[token] = await orama.tokenizer.tokenize(word)
        orama.tokenizer.normalizationCache.set(key, token)
      }
      if (!Array.isArray(orama.data.positions[id][propName][token])) {
        orama.data.positions[id][propName][token] = []
      }
      const start = regExResult.index
      const length = regExResult[0].length
      orama.data.positions[id][propName][token].push({ start, length })
    }
  }
}

export async function searchWithHighlight(
  orama: OramaWithHighlight,
  params: SearchParams,
  language?: Language
): Promise<SearchResultWithHighlight> {
  const result = await search(orama, params, language)
  const queryTokens: string[] = await orama.tokenizer.tokenize(params.term ?? '', language)
  const hits = result.hits.map(hit =>
    Object.assign(hit, {
      positions: Object.fromEntries(
        Object.entries(orama.data.positions[hit.id]).map(([propName, tokens]) => [
          propName,
          Object.fromEntries(
            Object.entries(tokens).filter(([token]) => queryTokens.find(queryToken => token.startsWith(queryToken)))
          )
        ])
      )
    })
  )

  result.hits = hits

  // @ts-ignore
  return result
}
