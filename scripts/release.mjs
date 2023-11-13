import { spawn } from 'node:child_process'
import { resolve, relative } from 'node:path'

const rootDir = process.cwd()

const packages = [
  'orama',
  'plugin-astro',
  'plugin-data-persistence',
  'plugin-docusaurus',
  'plugin-match-highlight',
  'plugin-nextra',
  'plugin-parsedoc',
  'plugin-telemetry',
  'stemmers',
  'stopwords'
]

function step(message) {
  console.log(`\x1b[1m\x1b[32m--- ${message}\x1b[0m`)
}

async function execute(command, args, cwd) {
  if (!Array.isArray(args)) {
    args = [args]
  }

  let success, fail
  const promise = new Promise((resolve, reject) => {
    success = resolve
    fail = reject
  })

  if (cwd) {
    step(`Executing: ${command} ${args.join(' ')} (from folder ${relative(rootDir, cwd)}) ...`)
  } else {
    step(`Executing: ${command} ${args.join(' ')}  ...`)
  }

  const childProcess = spawn(command, args, { cwd, stdio: 'inherit' })

  childProcess.on('close', code => {
    if (code !== 0) {
      fail(new Error(`Process failed with status code ${code}.`))
    }

    success()
  })

  return promise
}

async function main() {
  await execute('pnpm', 'build')
  await execute('pnpm', 'test')

  for (const pkg of packages) {
    const cwd = resolve(rootDir, 'packages', pkg)
    await execute('pnpm', ['publish'], cwd)
  }
}

await main()
