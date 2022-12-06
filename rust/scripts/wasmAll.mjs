import fs from "fs";
import path from "path";
import TOML from "@iarna/toml";
import { wasm } from "./wasm.mjs";
import { __dirname, targets, artifactsDir, originalArtifactsDir } from "./common.mjs";

async function main() {
  if (fs.existsSync(artifactsDir)) {
    console.log('Removing old artifacts...');
    fs.rmSync(artifactsDir, { recursive: true });
  }

  for (const target of targets) {
    console.log("Building for target:", target, "\n");
    await wasmAll({ profile: "release", target });
  }

  fs.mkdirSync(artifactsDir, { recursive: true });
  fs.renameSync(originalArtifactsDir, artifactsDir, { recursive: true });
  fs.rmSync(path.join(__dirname(), '../src'), { recursive: true });
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
