import fs from "fs";
import path from "path";
import { execa } from "execa";
import { __dirname } from "./common.mjs";

export async function wasm({ crateFolder, profile, target, shouldOptimize }) {
  process.chdir(path.join(__dirname(), '..'));

  const artifactName = target;
  const outDir = path.resolve(path.join(__dirname(), "..", "src", "wasm", "artifacts", artifactName));
  const crate = crateFolder.replaceAll("-", "_");
  const wasmTarget = "wasm32-unknown-unknown";

  console.log("Compiling Rust...");
  await execa("cargo", ["build", "-p", crateFolder, "--profile", profile, "--target", wasmTarget]);

  console.log(`Creating output directory "${outDir}"...`);
  await fs.promises.mkdir(outDir, { recursive: true });

  const wasmFile = path.join(__dirname(), "../target", wasmTarget, profile, `${crate}.wasm`);

  console.log("Optimizing Wasm artifact...");
  await execa("wasm-opt", [wasmFile, "-o", wasmFile, "-O2", "--precompute"]);

  if (shouldOptimize) {
    const watFile = path.join(outDir, `${crate}.wat`);
    const optimizedWat = path.join(outDir, `${crate}_optimized.wat`);
    
    console.log("Generating textual version of the original Wasm artifact...");
    await execa("wasm-opt", [wasmFile, "-o", watFile, "-O0", "--emit-text"]);
  
    console.log("Generating textual version of the optimized Wasm artifact...");
    await execa("wasm-opt", [wasmFile, "-o", optimizedWat, "-O0", "--emit-text"]);
  }

  console.log("Generating node module...");
  await execa("wasm-bindgen", ["--target", target, "--out-dir", outDir, wasmFile]);
}
