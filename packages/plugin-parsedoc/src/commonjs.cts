import type { populate as esmPopulate, populateFromGlob as esmPopulateFromGlob } from './index.js'

// Keep in sync with the one in index.ts
export const defaultHtmlSchema = {
  type: 'string',
  content: 'string',
  path: 'string'
}

export interface OramaPluginParseDoc {
  populateFromGlob: typeof esmPopulateFromGlob
  populate: typeof esmPopulate
  defaultHtmlSchema: typeof defaultHtmlSchema
}

export type RequireCallback = (err: Error | undefined, orama?: OramaPluginParseDoc) => void

let _esmPopulateFromGlob: typeof esmPopulateFromGlob
let _esmPopulate: typeof esmPopulate

export async function populateFromGlob(
  ...args: Parameters<typeof esmPopulateFromGlob>
): ReturnType<typeof esmPopulateFromGlob> {
  if (!_esmPopulateFromGlob) {
    const imported = await import('./index.js')
    _esmPopulateFromGlob = imported.populateFromGlob
  }

  return _esmPopulateFromGlob(...args)
}

export async function populate(...args: Parameters<typeof esmPopulate>): ReturnType<typeof esmPopulate> {
  if (!_esmPopulate) {
    const imported = await import('./index.js')
    _esmPopulate = imported.populate
  }

  return _esmPopulate(...args)
}

export function requireOramaPluginParseDoc(callback: RequireCallback): void {
  import('./index.js')
    .then((loaded: OramaPluginParseDoc) => setTimeout(() => callback(undefined, loaded), 1))
    .catch((error: Error) => setTimeout(() => callback(error), 1))
}
