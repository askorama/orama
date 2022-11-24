import { argv } from "process";
import fs from "fs";
import path from "path";
import TOML from "@iarna/toml";
import { wasm } from "./wasm.mjs";

async function main() {
  const profile = process.env.LYRA_WASM_PROFILE || "release";
  const target = process.env.LYRA_WASM_TARGET || "nodejs";

  await wasmAll({ profile, target });  
}

async function wasmAll({ profile, target }) {
  const readStream = fs.createReadStream(path.resolve(path.join("Cargo.toml")));
  const cargoToml = await TOML.parse.stream(readStream);
  const workspaceMembers = cargoToml?.workspace?.members;
  const wasmCrates = workspaceMembers.filter((member) => member.endsWith("-wasm"));

  for (const wasmCrate of wasmCrates) {
    console.log("Processing crate:", wasmCrate);
    await wasm({ crateFolder: wasmCrate, profile, target });
  }
}

main()
  .then(() => {
    console.log("Build wasm OK!");
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
