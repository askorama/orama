import type { PropertiesSchema, Data } from "../types";
import type { Lyra } from "../types";
import * as ERRORS from "../errors";

export async function load<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  { index, docs, schema, frequencies, tokenOccurrencies }: Data<S>,
): Promise<void> {
  if (!lyra.edge) {
    throw new Error(ERRORS.GETTER_SETTER_WORKS_ON_EDGE_ONLY("load"));
  }

  lyra.index = index;
  lyra.docs = docs;
  lyra.schema = schema;
  lyra.frequencies = frequencies;
  lyra.tokenOccurrencies = tokenOccurrencies;
}
