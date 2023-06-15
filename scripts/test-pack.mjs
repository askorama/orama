import assert from 'node:assert'
import { exec } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('../', import.meta.url))
const destinationDir = resolve(rootDir, 'packages', process.argv[2], 'tmp')

async function execute(command, cwd) {
  const { HOME, PATH } = process.env
  const env = cwd ? { HOME, PATH } : process.env

  return new Promise((resolve, reject) => {
    exec(command, { cwd, env }, (error, stdout, stderr) => {
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

const pluginInfo = JSON.parse(
  await readFile(fileURLToPath(new URL('../packages/orama/package.json', import.meta.url)), 'utf-8'),
)

await rm(destinationDir, { force: true, recursive: true })
for (const pkg of ['orama', 'plugin-match-highlight', 'plugin-parsedoc', 'plugin-astro', 'plugin-docusaurus']) {
  const pluginPath = fileURLToPath(new URL(`../dist/orama-${pkg}-${pluginInfo.version}.tgz`, import.meta.url))

  if (existsSync(pluginPath)) {
    continue
  }

  console.log(`\x1b[1m\x1b[32m--- Packing @orama/${pkg}-${pluginInfo.version} for testing ...\x1b[0m`)
  const packResult = await execute(`pnpm pack --pack-destination ${destinationDir}`, resolve(rootDir, 'packages', pkg))
  console.log(packResult.stdout.trim())
  assert.equal(packResult.code, 0)
}
