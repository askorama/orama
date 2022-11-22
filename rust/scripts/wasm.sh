#!/usr/bin/env bash

set -exo pipefail

CRATE_FOLDER=$1
PROFILE=$2

if [ -z "$out" ]; then
  out="../src/wasm"
else
  out="$out/wasm"
fi

# renames dashes in crate name with underscores, needed by wasm-bindgen
CRATE=$(echo "$CRATE_FOLDER" | tr '-' '_')

cargo build -p $CRATE_FOLDER --profile ${PROFILE} --target=wasm32-unknown-unknown

echo 'Creating out dir...'
mkdir -p $out

echo 'Generating node module...'
wasm-bindgen \
  --target nodejs \
  --out-dir $out \
  target/wasm32-unknown-unknown/${PROFILE}/$CRATE.wasm;
