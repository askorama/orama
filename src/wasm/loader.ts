import type { TokenScore } from "../lyra";
import { currentRuntime } from "../utils";

let runtimeWasm: any;

export async function intersectTokenScores(arrays: TokenScore[][]): Promise<TokenScore[]> {
  if (runtimeWasm) {
    return runtimeWasm.intersectTokenScores(arrays) as TokenScore[];
  }

  switch (currentRuntime) {
    case "node":
    case "browser":
      const BrowserWasm = await import("../wasm/artifacts/web/lyra_utils_wasm");
      const wasmInterface1 = await BrowserWasm.default();
      runtimeWasm = wasmInterface1;
      const { data: browserData1 } = runtimeWasm.intersectTokenScores({ data: arrays });
      return browserData1;
    case "deno":
      const DenoWasm = await import("../wasm/artifacts/deno/lyra_utils_wasm");
      runtimeWasm = DenoWasm;
      const { data: denoData } = runtimeWasm.intersectTokenScores({ data: arrays });
      return denoData;
    default:
      const jsFallback = await import("../utils");
      runtimeWasm = jsFallback;
      return jsFallback.intersectTokenScores(arrays);
  }
}
