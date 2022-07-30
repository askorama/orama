import { Lyra, PropertiesSchema } from "./lyra";
import { tokenize } from "./tokenizer";

const baseId = Date.now().toString().slice(5);
let lastId = 0;

const k = 1024;
const nano = BigInt(1e3);
const milli = BigInt(1e6);
const second = BigInt(1e9);

export const isServer = typeof window === "undefined";

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatNanoseconds(value: number | bigint): string {
  if (typeof value === "number") {
    value = BigInt(value);
  }

  if (value < nano) {
    return `${value}ns`;
  } else if (value < milli) {
    return `${value / nano}μs`;
  } else if (value < second) {
    return `${value / milli}ms`;
  }

  return `${value / second}s`;
}

export function getNanosecondsTime(): bigint {
  if (isServer) {
    return process.hrtime.bigint();
  }

  return BigInt(Math.floor(performance.now() * 1e6));
}

export function uniqueId(): string {
  return `${baseId}-${lastId++}`;
}

export function getAllTokensInAllDocsByProperty<T extends PropertiesSchema>(
  lyra: Lyra<T>,
): { [key: string]: string[] } {
  const docs = lyra.docs;
  const properties = Object.keys(lyra.schema).filter(property => lyra.schema[property] === "string");
  const individualTokens = properties.reduce((acc, property) => ({ ...acc, [property]: [] }), {});

  for (const property of properties) {
    const individualProperty = (individualTokens as any)[property];
    for (const doc in docs) {
      const currentDoc = docs[doc][property];
      const tokens = tokenize(currentDoc as string);
      individualProperty.push(...tokens);
    }

    (individualTokens as any)[property] = individualProperty;
  }

  return individualTokens;
}

export function countOccurrencies<T>(list: T[], target: T): number {
  return list.reduce((acc, item) => (item === target ? acc + 1 : acc), 0);
}
