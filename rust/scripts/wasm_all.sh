#!/bin/bash

set -exo pipefail

profile="release"

base_dir=$(dirname "$0")
wasm_script="$base_dir/wasm.sh"

wasm_crates=( "lyra-utils-wasm" )

for crate in "${wasm_crates[@]}"; do
  $wasm_script $crate $profile
done
