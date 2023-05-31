import assert from 'node:assert'
import { exec, ExecException } from 'node:child_process'
import { existsSync } from 'node:fs'
import { cp, readdir, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { chdir } from 'node:process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'
import { create, load } from '@orama/orama'
import { OramaWithHighlight, SearchResultWithHighlight, searchWithHighlight } from '@orama/plugin-match-highlight'
import { schema } from '../src/types.js'
import { INDEX_FILE } from '../src/shared.js'

interface Execution {
  code: number
  stdout: string
  stderr: string
  error?: Error
}

const sandboxSource = fileURLToPath(new URL('./sandbox', import.meta.url))
const sandbox = resolve(tmpdir(), `orama-plugin-docusaurus-${Date.now()}`)

async function cleanup(): Promise<void> {
  await rm(sandbox, { force: true, recursive: true })
}

function search(database: OramaWithHighlight, term: string): Promise<SearchResultWithHighlight> {
  return searchWithHighlight(database, { term, properties: ['sectionTitle', 'sectionContent', 'type'] })
}

async function execute(command: string, cwd?: string): Promise<Execution> {
  const { HOME, PATH } = process.env
  const env = cwd ? { HOME, PATH } : process.env

  return new Promise((resolve: (execution: Execution) => void, reject: (error: Error) => void) => {
    exec(command, { cwd, env }, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        if (process.env.NODE_DEBUG?.includes('test')) {
          console.error('COMMAND ERRORED', error)
        }

        reject(error)
        return
      }

      if (process.env.NODE_DEBUG?.includes('test')) {
        console.error(`--- STDOUT [${command}] ---\n${stdout.trim()}\n\n`)
        console.error(`--- STDERR [${command}] ---\n${stderr.trim()}\n\n`)
      }
      resolve({ code: 0, stdout, stderr })
    })
  })
}

await cleanup()

await test('plugin is able to generate orama DB at build time', async () => {
  // Prepare the plugin
  const pluginInfo: Record<string, string> = JSON.parse(
    await readFile(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf-8')
  )
  const pluginPath = fileURLToPath(new URL(`../orama-plugin-docusaurus-${pluginInfo.version}.tgz`, import.meta.url))
  const packResult = await execute('pnpm pack')
  assert.equal(packResult.code, 0)

  // Prepare the sandbox
  await cp(sandboxSource, sandbox, { recursive: true })
  await cp(pluginPath, resolve(sandbox, 'plugin.tgz'))
  await rm(pluginPath)

  chdir(sandbox)

  // Install dependencies
  const installResult = await execute('npm install', sandbox)
  assert.equal(installResult.code, 0)

  // docusaurus build is successful
  const buildResult = await execute('./node_modules/.bin/docusaurus build', sandbox)
  assert.equal(buildResult.code, 0)

  // The orama DBs have been generated
  assert.ok(existsSync(resolve(sandbox, `build/${INDEX_FILE.replace('@VERSION@', 'current')}`)))
})

await test('generated DBs have indexed pages content', async () => {
  // Loading "animals DB"
  const rawCompressedData = await readFile(resolve(sandbox, `build/${INDEX_FILE.replace('@VERSION@', 'current')}`))
  const rawData = gunzipSync(rawCompressedData).toString('utf-8')
  const data = JSON.parse(rawData)

  const database = (await create({ schema })) as OramaWithHighlight
  await load(database, data)
  database.data.positions = data.positions

  // Search results seem reasonable
  const indexSearchResult = await search(database, 'index')
  assert.ok(indexSearchResult.count === 1)
  assert.ok(indexSearchResult.hits[0].document.pageRoute === '/')

  const catSearchResult = await search(database, 'cat')
  assert.ok(catSearchResult.count === 1)
  assert.ok(catSearchResult.hits[0].document.pageRoute === '/animals_cat')

  const dogSearchResult = await search(database, 'dog')
  assert.ok(dogSearchResult.count === 2)
  assert.ok(dogSearchResult.hits[0].document.pageRoute === '/animals_dog')

  const domesticSearchResult = await search(database, 'domestic')
  assert.ok(domesticSearchResult.count === 2)
  assert.ok(domesticSearchResult.hits[0].document.pageRoute === '/animals_cat')
  assert.ok(domesticSearchResult.hits[1].document.pageRoute === '/animals_dog')

  // We do not have content about turtles
  const turtleSearchResult = await search(database, 'turtle')
  assert.ok(turtleSearchResult.count === 0)
})

await cleanup()
