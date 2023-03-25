import { createTokenizer as esmCreateTokenizer } from '../../components/tokenizer/index.js'

let _esmCreateTokenizer: typeof esmCreateTokenizer

export async function createTokenizer(
  ...args: Parameters<typeof esmCreateTokenizer>
): ReturnType<typeof esmCreateTokenizer> {
  if (!_esmCreateTokenizer) {
    const imported = await import('../../components/tokenizer/index.js')
    _esmCreateTokenizer = imported.createTokenizer
  }

  return _esmCreateTokenizer(...args)
}
