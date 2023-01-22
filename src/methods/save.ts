import type { Data, Lyra, PropertiesSchema } from "../types.js";

export async function save<S extends PropertiesSchema>(lyra: Lyra<S>): Promise<Data<S>> {
  return {
    index: lyra.index,
    docs: lyra.docs,
    schema: lyra.schema,
    frequencies: lyra.frequencies,
    tokenOccurrencies: lyra.tokenOccurrencies,
    defaultLanguage: lyra.defaultLanguage,
    avgFieldLength: lyra.avgFieldLength,
    fieldLengths: lyra.fieldLengths,
  };
}
