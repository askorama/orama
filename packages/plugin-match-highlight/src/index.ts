import { Language, Orama, PropertiesSchema, ResolveSchema, RetrievedDoc, search, SearchParams } from '@orama/orama'
import { normalizationCache, tokenize } from '@orama/orama/internals'

export interface Position {
  start: number
  length: number
}

export type OramaWithHighlight<S extends PropertiesSchema> = Orama<S> & {
  positions: Record<string, Record<string, Record<string, Position[]>>>
}

export type SearchResultWithHighlight<S extends PropertiesSchema> = RetrievedDoc<S> & {
  positions: Record<string, Record<string, Position[]>>
}

export async function afterInsert<S extends PropertiesSchema>(
  this: Orama<S> | OramaWithHighlight<S>,
  id: string
): Promise<void> {
  if (!('positions' in this)) {
    Object.assign(this, { positions: {} })
  }

  recursivePositionInsertion(this as OramaWithHighlight<S>, this.docs[id]!, id)
}

const wordRegEx = /[\p{L}0-9_'-]+/gimu

function recursivePositionInsertion<S extends PropertiesSchema>(
  orama: OramaWithHighlight<S>,
  doc: ResolveSchema<S>,
  id: string,
  prefix = '',
  schema: PropertiesSchema = orama.schema
): void {
  orama.positions[id] = Object.create(null)
  for (const key of Object.keys(doc)) {
    const isNested = typeof doc[key] === 'object'
    const isSchemaNested = typeof schema[key] === 'object'
    const propName = `${prefix}${key}`
    if (isNested && key in schema && isSchemaNested) {
      recursivePositionInsertion(
        orama,
        doc[key] as ResolveSchema<S>,
        id,
        propName + '.',
        schema[key] as PropertiesSchema
      )
    }
    if (!(typeof doc[key] === 'string' && key in schema && !isSchemaNested)) {
      continue
    }
    orama.positions[id][propName] = Object.create(null)
    const text = doc[key] as string
    let regExResult
    while ((regExResult = wordRegEx.exec(text)) !== null) {
      const word = regExResult[0].toLowerCase()
      const key = `${orama.defaultLanguage}:${word}`
      let token: string
      if (normalizationCache.has(key)) {
        token = normalizationCache.get(key)
        /* c8 ignore next 4 */
      } else {
        ;[token] = tokenize(word)
        normalizationCache.set(key, token)
      }
      if (!Array.isArray(orama.positions[id][propName][token])) {
        orama.positions[id][propName][token] = []
      }
      const start = regExResult.index
      const length = regExResult[0].length
      orama.positions[id][propName][token].push({ start, length })
    }
  }
}

export async function searchWithHighlight<S extends PropertiesSchema>(
  orama: OramaWithHighlight<S>,
  params: SearchParams<S>,
  language?: Language
): Promise<Array<SearchResultWithHighlight<S>>> {
  const result = await search(orama, params, language)
  const queryTokens: string[] = tokenize(params.term)
  return result.hits.map(hit =>
    Object.assign(hit, {
      positions: Object.fromEntries(
        Object.entries(orama.positions[hit.id]).map(([propName, tokens]) => [
          propName,
          Object.fromEntries(
            Object.entries(tokens).filter(([token]) => queryTokens.find(queryToken => token.startsWith(queryToken)))
          )
        ])
      )
    })
  )
}
