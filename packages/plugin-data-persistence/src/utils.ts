import type { Runtime } from './types.js'

export function detectRuntime(): Runtime {
  /* c8 ignore next 11 */
  if (typeof process !== 'undefined' && process.versions !== undefined) {
    return 'node'

    // @ts-expect-error "Deno" global variable is defined in Deno only
  } else if (typeof Deno !== 'undefined') {
    return 'deno'
    // @ts-expect-error "Bun" global variable is defined in Bun only
  } else if (typeof Bun !== 'undefined') {
    return 'bun'
  } else if (typeof window !== 'undefined') {
    return 'browser'
  }

  return 'unknown'
}
