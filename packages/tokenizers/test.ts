import T from './dist/tokenizer-mandarin/tokenizer.js'

const { createTokenizer } = T
console.log(createTokenizer)

const t = await createTokenizer({ language: 'mandarin' })

const a = await t.tokenize('你好吗？')
console.log(a)
