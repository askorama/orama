#!/usr/bin/env zx

const packages = [
  'orama',
  'plugin-astro',
  'plugin-data-persistence',
  'plugin-docusaurus',
  'plugin-match-highlight',
  'plugin-parsedoc',
]

await $`turbo test`
await $`turbo build`

await $`cp README.md packages/orama/README.md`

for (const pkg of packages) {
  const cwd = process.cwd()
  await $`cd ${cwd}/packages/${pkg} && pnpm publish`
}
