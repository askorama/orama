#!/bin/bash

set -x -e

tsc -p . --emitDeclarationOnly
tsc -p tsconfig.cjs.json --emitDeclarationOnly
tsc --module CommonJS --outDir dist/server/cjs/ src/server/types.ts

mv dist/server/commonjs.js dist/server/commonjs.cjs
mv dist/server/commonjs.js.map dist/server/commonjs.cjs.map
mv dist/server/cjs/types.js dist/server/types.cjs && rm -r dist/server/cjs

cp -a src/translationMessages dist/translationMessages
cp src/client/theme/SearchBar/*.css dist/client/theme/SearchBar
cp src/client/theme/SearchBarFooter/*.css dist/client/theme/SearchBarFooter