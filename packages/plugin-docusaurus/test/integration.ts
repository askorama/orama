import assert from 'node:assert'
import { exec, ExecException } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { getOrama } from '../src/client/theme/SearchBar/getOrama.js'

interface Execution {
  code: number
  stdout: string
  stderr: string
  error?: Error
}

const sandbox = fileURLToPath(new URL('../../plugin-docusaurus-sandbox', import.meta.url))

async function cleanup(): Promise<void> {
  for (const path of ['.docusaurus', 'build', 'node_modules', 'pnpm-lock.yaml']) {
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

  // Install dependencies
  const pnpmInstallResult = await execute('pnpm install')
  assert.equal(pnpmInstallResult.code, 0)

  // docusaurus build is successful
  const docusaurusBuildResult = await execute('docusaurus build')
  assert.equal(docusaurusBuildResult.code, 0)

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
