import {
  AnyDocument, AnyOrama,
  Language,
  RawData,
  Result, Results,
  SearchParams, TypedDocument,
  load,
  save,
  search
} from '@orama/orama'

export interface Position {
  start: number
  length: number
}

export type OramaWithHighlight<T extends AnyOrama> = T & {
  data: { positions: Record<string, Record<string, Record<string, Position[]>>> }
}

export type SearchResultWithHighlight<ResultDocument> = Results<ResultDocument> & {
  hits: (Result<ResultDocument> & { positions: Position[] })[]
}

export type RawDataWithPositions = RawData & {
  positions: Record<string, Record<string, Record<string, Position[]>>>
}

export async function afterInsert<T extends AnyOrama>(orama: T, id: string): Promise<void> {
  if (!('positions' in orama.data)) {
    Object.assign(orama.data, { positions: {} })
  }

  await recursivePositionInsertion(
    orama as OramaWithHighlight<T>,
    (await orama.documentsStore.get(orama.data.docs, id))!,
    id
  )
}

const wordRegEx = /[\p{L}0-9_'-]+/gimu

async function recursivePositionInsertion<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: OramaWithHighlight<T>,
  doc: ResultDocument,
  id: string,
  prefix = '',
  schema: T['schema'] = orama.schema
): Promise<void> {
  orama.data.positions[id] = Object.create(null)
  for (const key of Object.keys(doc as object) as Array<keyof ResultDocument>) {
    const isNested = typeof doc[key] === 'object'
    const isSchemaNested = typeof schema[key] === 'object'
    const propName = `${prefix}${String(key)}`
    if (isNested && key in schema && isSchemaNested) {
      recursivePositionInsertion(orama, doc[key], id, propName + '.', schema[key])
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

export async function searchWithHighlight<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: OramaWithHighlight<T>,
  params: SearchParams<T, ResultDocument>,
  language?: Language
): Promise<SearchResultWithHighlight<ResultDocument>> {
  const result = await search(orama, params, language)
  const queryTokens: string[] = await orama.tokenizer.tokenize(params.term ?? '', language)
  const hits = result.hits.map((hit: AnyDocument) =>
    Object.assign(hit, {
      positions: Object.fromEntries(
        Object.entries<any>(orama.data.positions[hit.id]).map(([propName, tokens]) => [
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

export async function saveWithHighlight<T extends AnyOrama>(orama: T): Promise<RawDataWithPositions> {
  const data = await save(orama)

  return {
    ...data,
    positions: (orama as OramaWithHighlight<T>).data.positions
  }
}

export async function loadWithHighlight<T extends AnyOrama>(orama: T, raw: RawDataWithPositions): Promise<void> {
  await load(orama, raw);
  (orama as OramaWithHighlight<T>).data.positions = raw.positions
}
