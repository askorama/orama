import { create as createOramaDB, load as loadOramaDB, Schema, search } from '@orama/orama'
import assert from 'node:assert'
import { exec, ExecException } from 'node:child_process'
import { existsSync } from 'node:fs'
import { cp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { chdir } from 'node:process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

interface Execution {
  code: number
  stdout: string
  stderr: string
  error?: Error
}

const sandboxSource = fileURLToPath(new URL('./sandbox', import.meta.url))
const sandbox = resolve(tmpdir(), `orama-plugin-astro-${Date.now()}`)

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
  const pluginPath = fileURLToPath(new URL(`../orama-plugin-astro-${pluginInfo.version}.tgz`, import.meta.url))
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

  // astro build is successful
  const buildResult = await execute('./node_modules/.bin/astro build', sandbox)
  assert.equal(buildResult.code, 0)

  // The Orama DBs have been generated
  assert.ok(existsSync(resolve(sandbox, 'dist', 'assets', 'oramaDB_animals.json')))
  assert.ok(existsSync(resolve(sandbox, 'dist', 'assets', 'oramaDB_games.json')))
})

await test('generated DBs have indexed pages content', async () => {
  // Loading "animals DB"
  const rawAnimalsData = await readFile(resolve(sandbox, 'dist/assets/oramaDB_animals.json'), 'utf8')
  const animalsData = JSON.parse(rawAnimalsData) as Schema
  const animalsDB = await createOramaDB({ schema: { _: 'string' } })
  await loadOramaDB(animalsDB, animalsData as any)

  // Loading "games DB"
  const rawGamesData = await readFile(resolve(sandbox, 'dist/assets/oramaDB_games.json'), 'utf8')
  const gamesData = JSON.parse(rawGamesData) as Schema
  const gamesDB = await createOramaDB({ schema: { _: 'string' } })
  await loadOramaDB(gamesDB, gamesData as any)

  // Search results seem reasonable
  const catSearchResult = await search(animalsDB, { term: 'cat' })
  assert.ok(catSearchResult.count === 1)
  assert.ok((catSearchResult.hits[0].document as unknown as { path: string }).path === '/animals_cat/')

  const dogSearchResult = await search(animalsDB, { term: 'dog' })
  assert.ok(dogSearchResult.count === 1)
  assert.ok((dogSearchResult.hits[0].document as unknown as { path: string }).path === '/animals_dog/')

  const domesticSearchResult = await search(animalsDB, { term: 'domestic' })
  assert.ok(domesticSearchResult.count === 2)

  // We do not have content about turtles
  const turtleSearchResult = await search(animalsDB, { term: 'turtle' })
  assert.ok(turtleSearchResult.count === 0)
})

await cleanup()
