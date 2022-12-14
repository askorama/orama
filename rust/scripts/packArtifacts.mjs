import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyFileSync } from 'node:fs'
import { buildSync } from 'esbuild'
import { targets } from './common.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url));

const builds = ['cjs', 'esm']
const wasmUtilName = 'lyra_utils_wasm.js'
const baseDir = join(__dirname, '../..')

for (const target of targets) {
  for (const build of builds) {
    console.log(`Bundling ${target} ${build}...`)

    const entryPoints = [join(baseDir, 'src/wasm/artifacts', target, wasmUtilName)]
    const outfile = join(baseDir, 'dist/', build, 'src/wasm/artifacts', target, wasmUtilName)
    const wasmFile = join(baseDir, 'src/wasm/artifacts', target, 'lyra_utils_wasm_bg.wasm')

    copyFileSync(wasmFile, join(baseDir, 'dist/', build, 'src/wasm/artifacts', target, 'lyra_utils_wasm_bg.wasm'))

    if (target === 'deno') {
      copyFileSync(entryPoints[0], outfile)
      continue
    }

    if (target === 'web' && build === 'cjs') {
      copyFileSync(wasmFile, join(baseDir, 'dist/browser/src/wasm/artifacts', target, 'lyra_utils_wasm_bg.wasm'))
      copyFileSync(join(baseDir, 'src/wasm/artifacts/deno/lyra_utils_wasm_bg.wasm'), join(baseDir, 'dist/browser/src/wasm/artifacts/deno/lyra_utils_wasm_bg.wasm'))
      copyFileSync(join(baseDir, 'src/wasm/artifacts/nodejs/lyra_utils_wasm_bg.wasm'), join(baseDir, 'dist/browser/src/wasm/artifacts/nodejs/lyra_utils_wasm_bg.wasm'))
    }

    let platform;

    switch (target) {
      case 'nodejs':
        platform = 'node'
        break
      case 'web':
        platform = 'browser'
        break
      default:
        platform = 'neutral'
    }

    buildSync({
      entryPoints: entryPoints,
      outfile: outfile,
      bundle: false,
      platform,
      minify: false,
      format: build === 'cjs' ? 'cjs' : 'esm',
    })
  }
}