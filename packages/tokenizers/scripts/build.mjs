import path from 'node:path'
import fs from 'node:fs'
import childProcess from 'node:child_process'

const outdirBaseURL = new URL('../dist', import.meta.url).pathname
const tokenizersBaseURL = new URL('../src', import.meta.url).pathname

const mandarinTokenizerPath = path.join(tokenizersBaseURL, 'tokenizer-mandarin')
const mandarinTokenizerWasmPath = path.join(mandarinTokenizerPath, 'pkg')
const mandarinTokenizerDistPath = path.join(tokenizersBaseURL, '../dist/tokenizer-mandarin')

if (fs.existsSync(outdirBaseURL)) {
  fs.rmdirSync(outdirBaseURL, { recursive: true })
}

fs.mkdirSync(outdirBaseURL)

childProcess.execSync(`cd ${mandarinTokenizerPath} && wasm-pack build --target web`)

fs.cpSync(mandarinTokenizerWasmPath, mandarinTokenizerDistPath, {
  recursive: true
})
