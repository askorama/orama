import type { TokenScore } from "../lyra";
import { currentRuntime } from "../utils";

let runtimeWasm: any;

export async function intersectTokenScores(arrays: TokenScore[][]): Promise<TokenScore[]> {
  if (runtimeWasm) {
    return runtimeWasm.intersectTokenScores(arrays);
  }

  switch (currentRuntime) {
    case "node": {
      runtimeWasm = await import("./artifacts/nodejs/lyra_utils_wasm");
      const { data } = runtimeWasm.intersectTokenScores({ data: arrays });
      return data;
    }
    case "browser": {
      const wasm = await import("./artifacts/web/lyra_utils_wasm");
      const wasmInterface = await wasm.default();
      runtimeWasm = wasmInterface;
      const { data } = runtimeWasm.intersectTokenScores({ data: arrays });
      return data;
    }
    case "deno": {
      runtimeWasm = await import("./artifacts/deno/lyra_utils_wasm");
      const { data } = runtimeWasm.intersectTokenScores({ data: arrays });
      return data;
    }
    default: {
      runtimeWasm = await import("../utils");
      return runtimeWasm.intersectTokenScores(arrays);
    }
  }
}
