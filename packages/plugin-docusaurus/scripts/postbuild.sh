#!/bin/bash

set -x -e

tsc -p . --emitDeclarationOnly
tsc -p tsconfig.cjs.json --emitDeclarationOnly

mv dist/server/commonjs.js dist/server/commonjs.cjs
mv dist/server/commonjs.js.map dist/server/commonjs.cjs.map

cp -a src/translationMessages dist/translationMessages
cp src/client/theme/SearchBar/*.css dist/client/theme/SearchBar