import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const __dirname = () => dirname(fileURLToPath(import.meta.url));
export const targets = ["nodejs", "web", "deno"];
export const artifactsDir = join(__dirname(), '../../src/wasm/artifacts');
export const originalArtifactsDir = join(__dirname(), '../src/wasm/artifacts');
