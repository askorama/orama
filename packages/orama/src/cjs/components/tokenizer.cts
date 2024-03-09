import { createTokenizer as esmCreateTokenizer } from '../../components/tokenizer/index.ts'

let _esmCreateTokenizer: typeof esmCreateTokenizer

export async function createTokenizer(
  ...args: Parameters<typeof esmCreateTokenizer>
): ReturnType<typeof esmCreateTokenizer> {
  if (!_esmCreateTokenizer) {
    const imported = await import('../../components/tokenizer/index.ts')
    _esmCreateTokenizer = imported.createTokenizer
  }

  return _esmCreateTokenizer(...args)
}
