#!/bin/bash

set -x -e

PATH=$PATH:$PWD/node_modules/.bin

# Install ripgrep
if [ -z "$(command -v rg)" ]; then
  curl -S -L -o /tmp/ripgrep.tar.gz https://github.com/BurntSushi/ripgrep/releases/download/13.0.0/ripgrep-13.0.0-x86_64-unknown-linux-musl.tar.gz
  tar -zxvf /tmp/ripgrep.tar.gz ripgrep-13.0.0-x86_64-unknown-linux-musl/rg -O > node_modules/.bin/rg && chmod a+x node_modules/.bin/rg
fi

# Build source code
/bin/rm -rf dist
swc  --delete-dir-on-start -d dist/src src -C sourceMaps=false
swc  --delete-dir-on-start -d dist/tests tests -C sourceMaps=false -C exclude="tests/ci"
rg 'from "tap"' dist -l | xargs -I % -- sed -e 's#import t from "tap"#const t = globalThis.t#' -i'' -- %

# Copy stemmer
/bin/cp -a stemmer/lib dist/src/stemmer
/bin/cp -a stemmer dist
/bin/cp -a tests/datasets dist/tests
/bin/cp -a tests/snapshots dist/tests

# Create the list of tests to run
echo "export const files = [" > dist/tests/_tests.js
rg 'const t = globalThis.t' dist -l | sort | sed -E -e 's#(.+)#"../../\1",#' >> dist/tests/_tests.js
echo "]" >> dist/tests/_tests.js