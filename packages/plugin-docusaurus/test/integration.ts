import { create, load, search } from "@orama/orama"
import assert from 'node:assert'
import { exec, ExecException } from 'node:child_process'
import { existsSync } from 'node:fs'
import { cp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { chdir } from 'node:process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'
import { INDEX_FILE, schema } from '../src/server/types.js'

interface Execution {
  code: number
  stdout: string
  stderr: string
  error?: Error
}

const sandboxSource = fileURLToPath(new URL('./sandbox', import.meta.url))
const sandbox = process.env.KEEP_SANDBOX_DOCUSAURUS
  ? '/tmp/orama-docusaurus-sandbox'
  : resolve(tmpdir(), `orama-plugin-docusaurus-${Date.now()}`)

async function cleanup(): Promise<void> {
  await rm(sandbox, { force: true, recursive: true })
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
  // Obtain general information
  const pluginInfo: Record<string, string> = JSON.parse(
    await readFile(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf-8')
  )
  const rootDir = dirname(fileURLToPath(new URL(`../..`, import.meta.url)))
  const version = pluginInfo.version

  // Prepare the sandbox
  const packageJsonPath = resolve(sandbox, 'package.json')
  await cp(sandboxSource, sandbox, { recursive: true })
  chdir(sandbox)
  console.log(`Sandbox created in ${sandbox}`)

  // Update dependencies location
  const packageJson = await readFile(packageJsonPath, 'utf-8')
  await writeFile(packageJsonPath, packageJson.replace(/@ROOT@/g, rootDir).replace(/@VERSION@/g, version), 'utf-8')

  // Install dependencies
  const installResult = await execute('pnpm install', sandbox)
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

  const database = await create({ schema })
  await load(database, data)

  // Search results seem reasonable
  const indexSearchResult = await search(database, { term: 'index', properties: ['sectionTitle', 'sectionContent', 'type'] })
  assert.ok(indexSearchResult.count === 1)
  assert.ok(indexSearchResult.hits[0].document.pageRoute === '/#main')

  const catSearchResult = await search(database, { term: 'cat', properties: ['sectionTitle', 'sectionContent', 'type'] })
  assert.ok(catSearchResult.count === 1)
  assert.ok(catSearchResult.hits[0].document.pageRoute === '/animals_cat')

  const dogSearchResult = await search(database, { term: 'dog', properties: ['sectionTitle', 'sectionContent', 'type'] })
  assert.ok(dogSearchResult.count === 2)
  assert.ok(dogSearchResult.hits[0].document.pageRoute === '/animals_dog#dog')

  const domesticSearchResult = await search(database, { term: 'domestic', properties: ['sectionTitle', 'sectionContent', 'type'] })
  assert.ok(domesticSearchResult.count === 2)
  assert.ok(domesticSearchResult.hits[0].document.pageRoute === '/animals_cat')
  assert.ok(domesticSearchResult.hits[1].document.pageRoute === '/animals_dog#dog')

  // We do not have content about turtles
  const turtleSearchResult = await search(database, { term: 'turtle', properties: ['sectionTitle', 'sectionContent', 'type'] })
  assert.ok(turtleSearchResult.count === 0)
})

if (!process.env.KEEP_SANDBOX_DOCUSAURUS) {
  await cleanup()
}
