import path from 'node:path'
import fs from 'node:fs'
import childProcess from 'node:child_process'

if (process.env.GITHUB_ACTIONS) {
  console.log('Skipping build in CI')
  process.exit(0)
}

const outdirBaseURL = new URL('../dist', import.meta.url).pathname
const tokenizersBaseURL = new URL('../src', import.meta.url).pathname

const mandarinTokenizerPath = path.join(tokenizersBaseURL, 'tokenizer-mandarin')
const mandarinTokenizerWasmPath = path.join(mandarinTokenizerPath, 'pkg')
const mandarinTokenizerDistPath = path.join(tokenizersBaseURL, '../dist/tokenizer-mandarin')
const mandarinTokenizerWrapperPath = path.join(tokenizersBaseURL, 'tokenizer-mandarin/src/tokenizer.ts')
const mandarinTokenizerWrapperDistPath = path.join(mandarinTokenizerDistPath, 'tokenizer.ts')

if (fs.existsSync(outdirBaseURL)) {
  fs.rmdirSync(outdirBaseURL, { recursive: true })
}

fs.mkdirSync(outdirBaseURL)

childProcess.execSync(`cd ${mandarinTokenizerPath} && wasm-pack build --target web`)

fs.cpSync(mandarinTokenizerWrapperPath, mandarinTokenizerWrapperDistPath, {
  recursive: true
})

fs.cpSync(mandarinTokenizerWasmPath, mandarinTokenizerDistPath, {
  recursive: true
})

childProcess.execFileSync(`cd ${mandarinTokenizerDistPath} && npx tsup --format cjs,esm,iife tokenizer.ts --outDir .`)
