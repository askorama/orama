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
cp -a stemmer/lib dist/stemmer
swc --delete-dir-on-start --extensions .js -d dist/cjs/stemmer/ stemmer/lib --no-swcrc -C module.type="commonjs"
mv dist/cjs/stemmer/lib/* dist/cjs/stemmer
rm -rf dist/cjs/stemmer/lib
cp -a stemmer/lib/*.d.ts dist/cjs/stemmer 
fd . -e js dist/cjs/ -x mv {} {.}.cjs
fd . -e ts dist/cjs/ -x mv {} {.}.cts