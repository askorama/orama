import fs from "fs";
import path from "path";
import url from "url";
import { execa } from "execa";

export async function wasm({ crateFolder, profile, target, shouldOptimize }) {
  const outDir = path.resolve(path.join("..", "src", "wasm", "artifacts", target));
  const crate = crateFolder.replaceAll("-", "_");
  const wasmTarget = "wasm32-unknown-unknown";

  console.log("Compiling Rust...");
  await execa("cargo", ["build", "-p", crateFolder, "--profile", profile, "--target", wasmTarget]);

  console.log(`Creating output directory "${outDir}"...`);
  await fs.promises.mkdir(outDir, { recursive: true });

  const wasmFile = path.join("target", wasmTarget, profile, `${crate}.wasm`);
  
  if (shouldOptimize) {
    const watFile = path.join(outDir, `${crate}.wat`);
    const optimizedWat = path.join(outDir, `${crate}_optimized.wat`);
    
    console.log("Generating textual version of the original Wasm artifact...");
    await execa("wasm-opt", [wasmFile, "-o", watFile, "-O0", "--emit-text"]);
  
    console.log("Optimizing Wasm artifact...");
    await execa("wasm-opt", [wasmFile, "-o", wasmFile, "-O2", "--precompute"]);
  
    console.log("Generating textual version of the optimized Wasm artifact...");
    await execa("wasm-opt", [wasmFile, "-o", optimizedWat, "-O0", "--emit-text"]);
  }

  console.log("Generating node module...");
  await execa("wasm-bindgen", ["--target", target, "--out-dir", outDir, wasmFile]);
}

async function main() {
  const crateFolder = process.argv[2];

  const profile = process.env.LYRA_WASM_PROFILE || "release";
  const target = process.env.LYRA_WASM_TARGET || "nodejs";
  const shouldOptimize = process.env.LYRA_WASM_OPT === "1";

  await wasm({ crateFolder, profile, target, shouldOptimize });
}

function isRunDirectly() {
  const ownFilename = url.fileURLToPath(import.meta.url);
  return ownFilename === process.argv?.[1];
}

if (isRunDirectly()) {
  main();
}
