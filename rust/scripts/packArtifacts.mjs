import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyFileSync } from 'node:fs'
import { buildSync } from 'esbuild'
import { targets } from './wasmAll.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url));

const builds = ['cjs', 'esm']
const wasmUtilName = 'lyra_utils_wasm.js'
const baseDir = join(__dirname, '../..')

for (const target of targets) {
  for (const build of builds) {
    console.log(`Building ${target} ${build}...`)

    const entryPoints = [join(baseDir, 'src/wasm/artifacts', target, wasmUtilName)]
    const outfile = join(baseDir, 'dist/', build, 'src/wasm/artifacts', target, wasmUtilName)

    if (target === 'deno') {
      copyFileSync(entryPoints[0], outfile)
      continue
    }

    buildSync({
      entryPoints: entryPoints,
      outfile: outfile,
      bundle: false,
      platform: 'neutral',
      minify: true,
      format: build === 'cjs' ? 'cjs' : 'esm',
    })
  }
}