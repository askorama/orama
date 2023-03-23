#/!bin/bash

set -x -e

PATH=$PATH:$PWD/node_modules/.bin

# Install fd
if [ -z "$(command -v fd)" ]; then
  curl -S -L -o /tmp/fd.tar.gz https://github.com/sharkdp/fd/releases/download/v8.6.0/fd-v8.6.0-i686-unknown-linux-musl.tar.gz
  tar -zxvf /tmp/fd.tar.gz fd-v8.6.0-i686-unknown-linux-musl/fd -O > node_modules/.bin/fd && chmod a+x node_modules/.bin/fd
fi

tsc -p . --emitDeclarationOnly
tsc -p tsconfig.cjs.json --emitDeclarationOnly
cp -a stemmers/lib dist/stemmers
swc --delete-dir-on-start --extensions .js -d dist/cjs/stemmers/ stemmers/lib --no-swcrc -C module.type="commonjs"
mv dist/cjs/stemmers/lib/* dist/cjs/stemmers
rm -rf dist/cjs/stemmers/lib
cp -a stemmers/lib/*.d.ts dist/cjs/stemmers
sed -i '' -E -re 's#@stemmers#../../stemmers#' dist/components/tokenizer/stemmers.d.ts
fd . -e js dist/cjs/ -x mv {} {.}.cjs
fd . -e ts dist/cjs/ -x mv {} {.}.cts
mv dist/cjs/index.js.map dist/cjs/index.cjs.map
mv dist/cjs/internals.js.map dist/cjs/internals.cjs.map
mv dist/cjs/components.js.map dist/cjs/components.cjs.map
sed -i '' -E -re 's#require\("\./(.+)\.cts")#require("./\1.cjs")#' dist/cjs/index.cjs
sed -i '' -E -re 's#\.\./stemmers#./stemmers#' dist/cjs/stemmers.cjs
sed -i '' -E -re 's#@stemmers#./stemmers#' dist/cjs/stemmers.d.cts
