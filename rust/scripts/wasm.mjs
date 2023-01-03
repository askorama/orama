import { transformFile } from "@swc/core";
import { execa } from "execa";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile, rename } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));
const targets = ["nodejs", "web", "deno"];
const artifactsDir = resolve(rootDir, "../../dist/wasm");
const wasmCrates = ["lyra-utils-wasm"];

async function wasm({ crateFolder, profile, target, shouldOptimize }) {
  process.chdir(resolve(rootDir, ".."));

  const artifactName = target;
  const outDir = resolve(artifactsDir, artifactName);
  const crate = crateFolder.replaceAll("-", "_");
  const wasmTarget = "wasm32-unknown-unknown";

  console.log("Compiling Rust...");
  await execa("cargo", ["build", "-p", crateFolder, "--profile", profile, "--target", wasmTarget]);

  console.log(`Creating output directory "${outDir}"...`);
  await mkdir(outDir, { recursive: true });

  const wasmFile = resolve(rootDir, "../target", wasmTarget, profile, `${crate}.wasm`);

  console.log("Optimizing Wasm artifact...");
  await execa("wasm-opt", [wasmFile, "-o", wasmFile, "-O2", "--precompute"]);

  if (shouldOptimize) {
    const watFile = resolve(outDir, `${crate}.wat`);
    const optimizedWat = resolve(outDir, `${crate}_optimized.wat`);

    console.log("Generating textual version of the original Wasm artifact...");
    await execa("wasm-opt", [wasmFile, "-o", watFile, "-O0", "--emit-text"]);

    console.log("Generating textual version of the optimized Wasm artifact...");
    await execa("wasm-opt", [wasmFile, "-o", optimizedWat, "-O0", "--emit-text"]);
  }

  console.log("Generating node module...");
  await execa("wasm-bindgen", ["--target", target, "--out-dir", outDir, wasmFile]);
}

async function main() {
  for (const target of targets) {
    console.log("Building for target:", target, "\n");

    const currentArtifactsDir = resolve(artifactsDir, target);
    if (existsSync(currentArtifactsDir)) {
      console.log("Removing old artifacts...");
      await rm(currentArtifactsDir, { recursive: true });
    }

    for (const wasmCrate of wasmCrates) {
      console.log("Processing crate:", wasmCrate);
      await wasm({ crateFolder: wasmCrate, profile: "release", target, shouldOptimize: false });
    }

    const entrypoint = resolve(artifactsDir, target, "lyra_utils_wasm.js");
    const transformed = await transformFile(entrypoint, { swcrc: false, isModule: true });
    await writeFile(entrypoint, transformed.code);

    if (target === "nodejs") {
      await rename(entrypoint, entrypoint.replace(".js", ".cjs"));
    }
  }
}

main()
  .then(() => {
    console.log("Build WASM OK!");
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
