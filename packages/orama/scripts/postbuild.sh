#/!bin/bash

set -x -e

PATH=$PATH:$PWD/node_modules/.bin

# Install fd
if [ -z "$(command -v rnr)" ]; then
  curl -S -L -o /tmp/rnr.tar.gz https://github.com/ismaelgv/rnr/releases/download/v0.4.2/rnr-v0.4.2-x86_64-unknown-linux-musl.tar.gz
  tar -zxvf /tmp/rnr.tar.gz rnr-v0.4.2-x86_64-unknown-linux-musl/rnr -O > node_modules/.bin/rnr && chmod a+x node_modules/.bin/rnr
fi

# Install sd
if [ -z "$(command -v sd)" ]; then
  curl -S -L -o node_modules/.bin/sd https://github.com/chmln/sd/releases/download/v0.7.6/sd-v0.7.6-x86_64-unknown-linux-musl
  chmod a+x node_modules/.bin/sd
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
sd '@stemmers' '../../stemmers' dist/components/tokenizer/stemmers.d.ts
sd '\.\./stemmers' './stemmers' dist/cjs/stemmers.js
sd '\.js"\);' '.cjs");' dist/cjs/stemmers.js
sd '@stemmers' './stemmers' dist/cjs/stemmers.d.cts
sd "\.js';" ".cjs';" dist/cjs/stemmers.d.cts

# Use right extensions for files
sd 'require\("\./(.+)\.cts"\)' 'require("./$1.cjs")' dist/cjs/index.js
sd 'require\("\./(.+)\.cts"\)' 'require("./$1.cjs")' dist/cjs/components.js
rnr --no-dump -s -f -r -D "\.js" ".cjs" dist/cjs 
rnr --no-dump -s -f -r -D "\.ts" ".cts" dist/cjs 