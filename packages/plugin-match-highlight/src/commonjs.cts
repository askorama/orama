// @ts-expect-error Ignore broken resolution - This errors when using tsconfig.cjs.json
import type { Orama } from '@orama/orama'

import type {
  afterInsert as esmAfterInsert,
  OramaWithHighlight,
  searchWithHighlight as esmSearchWithHighlight
  // @ts-expect-error Ignore broken resolution - This errors when using tsconfig.cjs.json
} from './index.js'

export interface OramaPluginMatchHighlight {
  afterInsert: typeof esmAfterInsert
  searchWithHighlight: typeof esmSearchWithHighlight
}

export type RequireCallback = (err: Error | undefined, orama?: OramaPluginMatchHighlight) => void

let _esmAfterInsert: typeof esmAfterInsert
let _esmSearchWithHighlight: typeof esmSearchWithHighlight

export async function afterInsert(
  this: Orama | OramaWithHighlight,
  ...args: Parameters<typeof esmAfterInsert>
): ReturnType<typeof esmAfterInsert> {
  if (!_esmAfterInsert) {
    const imported = await import('./index.js')
    _esmAfterInsert = imported.afterInsert
  }

  return _esmAfterInsert.apply(this, args)
}

export async function searchWithHighlight(
  ...args: Parameters<typeof esmSearchWithHighlight>
): ReturnType<typeof esmSearchWithHighlight> {
  if (!_esmSearchWithHighlight) {
    const imported = await import('./index.js')
    _esmSearchWithHighlight = imported.searchWithHighlight
  }

  return _esmSearchWithHighlight(...args)
}

export function requireOramaPluginMatchHighlight(callback: RequireCallback): void {
  import('./index.js')
    .then((loaded: OramaPluginMatchHighlight) => setTimeout(() => callback(undefined, loaded), 1))
    .catch((error: Error) => setTimeout(() => callback(error), 1))
}
