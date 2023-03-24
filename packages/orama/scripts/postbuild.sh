#/!bin/bash

set -x -e

PATH=$PATH:$PWD/node_modules/.bin

# Install fd
if [ -z "$(command -v fd)" ]; then
  curl -S -L -o /tmp/fd.tar.gz https://github.com/sharkdp/fd/releases/download/v8.6.0/fd-v8.6.0-i686-unknown-linux-musl.tar.gz
  tar -zxvf /tmp/fd.tar.gz fd-v8.6.0-i686-unknown-linux-musl/fd -O > node_modules/.bin/fd && chmod a+x node_modules/.bin/fd
fi

# Compile using TSC
tsc -p . --emitDeclarationOnly
tsc -p tsconfig.cjs.json --emitDeclarationOnly

# Copy stemmers for ESM
cp -a stemmers/lib dist/stemmers

# Copy stemmers for CJS
swc --delete-dir-on-start --extensions .js -d dist/cjs/stemmers/ stemmers/lib --no-swcrc -C module.type="commonjs"
mv dist/cjs/stemmers/lib/* dist/cjs/stemmers
rm -rf dist/cjs/stemmers/lib
cp -a stemmers/lib/*.d.ts dist/cjs/stemmers

# Fix stemmers resolution
sed -i '' -E -re 's#@stemmers#../../stemmers#' dist/components/tokenizer/stemmers.d.ts
sed -i '' -E -re 's#@stemmers#./stemmers#' dist/cjs/stemmers.d.cts
sed -i '' -E -re 's#\.\./stemmers#./stemmers#' dist/cjs/stemmers.js
sed -i '' -E -re 's#\.js"\);#.cjs"\);#' dist/cjs/stemmers.js

# Use right extensions for files
fd . -e js dist/cjs/ -x mv {} {.}.cjs
fd . -e ts dist/cjs/ -x mv {} {.}.cts
sed -i '' -E -re 's#require\("\./(.+)\.cts")#require("./\1.cjs")#' dist/cjs/index.cjs
sed -i '' -E -re 's#require\("\./(.+)\.cts")#require("./\1.cjs")#' dist/cjs/components.cjs

# Use right extensions for source maps
for i in dist/cjs/*.js.map; do
  mv $i ${i/.js/.cjs};
done;

for i in dist/cjs/components/*.js.map; do
  mv $i ${i/.js/.cjs};
done;
