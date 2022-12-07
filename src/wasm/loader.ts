import type { TokenScore } from "../lyra";
import { currentRuntime, IIntersectTokenScores } from "../utils";

let _intersectTokenScores: IIntersectTokenScores;

export async function intersectTokenScores(arrays: TokenScore[][]): Promise<TokenScore[]> {
  if (!_intersectTokenScores) {
    let runtimeWasm: { intersectTokenScores: IIntersectTokenScores };

    switch (currentRuntime) {
      case "node":
        runtimeWasm = await import("./artifacts/nodejs/lyra_utils_wasm");
        break;
      case "browser": {
        const wasm = await import("./artifacts/web/lyra_utils_wasm");
        const wasmInterface = await wasm.default();
        runtimeWasm = wasmInterface as unknown as { intersectTokenScores: IIntersectTokenScores };
        break;
      }
      case "deno":
        runtimeWasm = await import("./artifacts/deno/lyra_utils_wasm");
        break;
      default:
        runtimeWasm = await import("../utils");
    }

    _intersectTokenScores = runtimeWasm.intersectTokenScores;
  }

  return _intersectTokenScores({ data: arrays }).data;
}
