import fs from "fs";
import path from "path";
import TOML from "@iarna/toml";
import { wasm } from "./wasm.mjs";
import { __dirname } from "./common.mjs";
import { targets } from "./packArtifacts.mjs";

async function main() {
  for (const target of targets) {
    console.log("Building for target:", target, "\n");
    await wasmAll({ profile: "release", target });
  }
}

async function wasmAll({ profile, target }) {
  const cargoPath = path.join(__dirname(), "..", "Cargo.toml");
  const readStream = fs.createReadStream(path.resolve(cargoPath));
  const cargoToml = await TOML.parse.stream(readStream);
  const workspaceMembers = cargoToml?.workspace?.members;
  const wasmCrates = workspaceMembers.filter((member) => member.endsWith("-wasm"));

  for (const wasmCrate of wasmCrates) {
    console.log("Processing crate:", wasmCrate);
    await wasm({ crateFolder: wasmCrate, profile, target, shouldOptimize: false });
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
