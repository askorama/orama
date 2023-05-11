import { minify, transform } from '@swc/core'
import glob from 'glob'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const rootDir = process.cwd()
const sourceDir = resolve(rootDir, 'src')
const destinationDir = resolve(rootDir, 'dist')

async function compile(swcConfig, jsExtension, tsExtension) {
  // Copy static files
  await cp(resolve(sourceDir, `index.${jsExtension}`), resolve(destinationDir, `index.${jsExtension}`))
  await cp(resolve(sourceDir, 'index.d.ts'), resolve(destinationDir, `index.d.${tsExtension}`))

  const filesGlob = await glob('*.js', { cwd: resolve(rootDir, 'lib') })

  await Promise.all(
    filesGlob.map(async file => {
      const lang = file.replace('.js', '')

      // Compile and minifiy the file using SWC
      const content = await readFile(resolve(rootDir, 'lib', file), 'utf-8')

      const compiled = await transform(content, swcConfig)

      const minified = await minify(compiled.code, { sourceMap: true })

      await writeFile(resolve(destinationDir, `${lang}.${jsExtension}`), minified.code, 'utf-8')
      await writeFile(resolve(destinationDir, `${lang}.${jsExtension}.map`), minified.map, 'utf-8')

      // Copy the definition file
      await cp(resolve(sourceDir, 'lang.d.ts'), resolve(destinationDir, `${lang}.d.${tsExtension}`))
    }),
  )
}

async function main() {
  // Remove and recreate destination directory
  await rm(destinationDir, { recursive: true, force: true })
  await mkdir(destinationDir)

  // Compile different versions
  // ESM
  await compile(
    {
      module: {
        type: 'nodenext',
      },
      env: {
        targets: 'node >= 16',
      },
      jsc: {
        target: 'es2022',
      },
    },
    'js',
    'ts',
  )

  // CJS
  await compile(
    {
      module: {
        type: 'commonjs',
      },
      env: {
        targets: 'node >= 16',
      },
      jsc: {
        target: 'es2022',
      },
    },
    'cjs',
    'cts',
  )

  // Copy the English stemmer to the Orama package
  const englishStemmer = await readFile(resolve(rootDir, 'lib/en.js'), 'utf-8')
  await writeFile(
    resolve(rootDir, '../orama/src/components/tokenizer/english-stemmer.ts'),
    `// eslint-disable-next-line @typescript-eslint/ban-ts-comment\n// @ts-nocheck\n\n${englishStemmer}`,
    'utf-8',
  )
}

await main()
