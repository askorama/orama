import { create as createOramaDB, Data, load as loadOramaDB, PropertiesSchema, search } from '@orama/orama'
import assert from 'node:assert'
import { exec, ExecException } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

interface Execution {
  code: number
  stdout: string
  stderr: string
  error?: Error
}

const sandbox = fileURLToPath(new URL('../../plugin-astro-sandbox', import.meta.url))

async function cleanup(): Promise<void> {
  for (const path of ['dist', 'node_modules', 'pnpm-lock.yaml']) {
    await rm(resolve(sandbox, path), { force: true, recursive: true })
  }
}

async function execute(command: string): Promise<Execution> {
  return new Promise((resolve: (execution: Execution) => void, reject: (error: Error) => void) => {
    exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        console.error('COMMAND ERRORED', error)
        reject(error)
        return
      }

      console.error(`--- STDOUT[${command}] ---\n${stdout.trim()}\n\n`)
      console.error(`--- STDERR[${command}] ---\n${stderr.trim()}\n\n`)
      resolve({ code: 0, stdout, stderr })
    })
  })
}

await cleanup()

await test('plugin is able to generate orama DB at build time', async () => {
  process.chdir(sandbox)

  // install dependencies
  const pnpmInstallResult = await execute('pnpm install')
  assert.equal(pnpmInstallResult.code, 0)

  // astro build is successful
  const astroBuildResult = await execute('astro build')
  assert.equal(astroBuildResult.code, 0)

  // The Orama DBs have been generated
  assert.ok(existsSync(resolve(sandbox, 'dist', 'assets', 'oramaDB_animals.json')))
  assert.ok(existsSync(resolve(sandbox, 'dist', 'assets', 'oramaDB_games.json')))
})

await test('generated DBs have indexed pages content', async () => {
  // Loading "animals DB"
  const rawAnimalsData = await readFile(resolve(sandbox, 'dist/assets/oramaDB_animals.json'), 'utf8')
  const animalsData = JSON.parse(rawAnimalsData) as Data<PropertiesSchema>
  const animalsDB = await createOramaDB({ schema: { _: 'string' } })
  await loadOramaDB(animalsDB, animalsData)

  // Loading "games DB"
  const rawGamesData = await readFile(resolve(sandbox, 'dist/assets/oramaDB_games.json'), 'utf8')
  const gamesData = JSON.parse(rawGamesData) as Data<PropertiesSchema>
  const gamesDB = await createOramaDB({ schema: { _: 'string' } })
  await loadOramaDB(gamesDB, gamesData)

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
