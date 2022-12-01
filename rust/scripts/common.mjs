import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const __dirname = () => dirname(fileURLToPath(import.meta.url));