import {createTokenizer} from './dist/tokenizer-mandarin/tokenizer.mjs'

console.log(createTokenizer)

const t = await createTokenizer({ language: 'mandarin' })

const a = await t.tokenize('你好吗？')
console.log(a)
