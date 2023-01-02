import type { PropertiesSchema, Data, Lyra } from "../types";

export async function save<S extends PropertiesSchema>(lyra: Lyra<S>): Promise<Data<S>> {
  return {
    index: lyra.index,
    docs: lyra.docs,
    schema: lyra.schema,
    frequencies: lyra.frequencies,
    tokenOccurrencies: lyra.tokenOccurrencies,
  };
}
