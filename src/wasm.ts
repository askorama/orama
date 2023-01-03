import { createRequire } from "module";
import type { TokenScore } from "./types.js";
import { currentRuntime, IIntersectTokenScores } from "./utils.js";

let _intersectTokenScores: IIntersectTokenScores;

export async function intersectTokenScores(arrays: TokenScore[][]): Promise<TokenScore[]> {
  if (!_intersectTokenScores) {
    let runtimeWasm: { intersectTokenScores: IIntersectTokenScores };

    switch (currentRuntime) {
      case "node": {
        const require = createRequire(import.meta.url);
        runtimeWasm = require("./wasm/nodejs/lyra_utils_wasm.cjs");
        break;
      }
      case "browser": {
        // @ts-expect-error built at runtime
        const wasm = await import("./wasm/web/lyra_utils_wasm.js");
        const wasmInterface = await wasm.default();
        runtimeWasm = wasmInterface as unknown as { intersectTokenScores: IIntersectTokenScores };
        break;
      }
      case "deno": {
        // @ts-expect-error built at runtime
        runtimeWasm = await import("./wasm/deno/lyra_utils_wasm.js");
        break;
      }
      default: {
        runtimeWasm = await import("./utils.js");
      }
    }

    _intersectTokenScores = runtimeWasm.intersectTokenScores;
  }

  return _intersectTokenScores({ data: arrays }).data;
}
