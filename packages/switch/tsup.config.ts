import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
  bundle: true,
  dts: true,
  minify: false,
  format: ['cjs', 'esm', 'iife'],
})