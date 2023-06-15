#!/bin/bash

set -x -e

tsc -p . --emitDeclarationOnly
tsc -p tsconfig.cjs.json --emitDeclarationOnly

mv dist/commonjs.js dist/commonjs.cjs
mv dist/commonjs.js.map dist/commonjs.cjs.map
mv dist/server-commonjs.js dist/server-commonjs.cjs
mv dist/server-commonjs.js.map dist/server-commonjs.cjs.map

