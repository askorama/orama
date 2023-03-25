import assert from 'node:assert'
import { exec, ExecException } from 'node:child_process'
import { existsSync } from 'node:fs'
import { cp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { chdir } from 'node:process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { getOrama } from '../src/client/theme/SearchBar/getOrama.js'

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
    await readFile(fileURLToPath(new URL(`../package.json`, import.meta.url)), 'utf-8')
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
  const installResult = await execute('pnpm install', sandbox)
  assert.equal(installResult.code, 0)

  // docusaurus build is successful
  const buildResult = await execute('./node_modules/.bin/docusaurus build', sandbox)
  assert.equal(buildResult.code, 0)

  // The orama DBs have been generated
  assert.ok(existsSync(resolve(sandbox, 'build/orama-search-index.json')))
})

await test('generated DBs have indexed pages content', async () => {
  // Loading "animals DB"
  const rawData = await readFile(resolve(sandbox, 'build/orama-search-index.json'), 'utf8')
  const data = JSON.parse(rawData)

  const search = await getOrama('http://localhost/', data)

  // Search results seem reasonable
  const indexSearchResult = await search('index')
  assert.ok(indexSearchResult.length === 1)
  assert.ok(indexSearchResult[0].document.pageRoute === 'http://localhost/')

  const catSearchResult = await search('cat')
  assert.ok(catSearchResult.length === 1)
  assert.ok(catSearchResult[0].document.pageRoute === 'http://localhost/animals_cat')

  const dogSearchResult = await search('dog')
  assert.ok(dogSearchResult.length === 4)
  assert.ok(dogSearchResult[0].document.pageRoute === 'http://localhost/animals_dog')

  const domesticSearchResult = await search('domestic')
  assert.ok(domesticSearchResult.length === 2)
  assert.ok(domesticSearchResult[0].document.pageRoute === 'http://localhost/animals_cat')
  assert.ok(domesticSearchResult[1].document.pageRoute === 'http://localhost/animals_dog')

  // We do not have content about turtles
  const turtleSearchResult = await search('turtle')
  assert.ok(turtleSearchResult.length === 0)
})

await cleanup()
