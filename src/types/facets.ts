import { PropertiesSchema, PropertyType } from "./index.js";

export type FacetSorting = "asc" | "desc" | "ASC" | "DESC";

export type FacetsSearch<S extends PropertiesSchema, P extends string = "", K extends keyof S = keyof S> = K extends string
  ? S[K] extends PropertiesSchema
    ? FacetsSearch<S[K], `${P}${K}.`>
    : S[K] extends PropertyType
      ? { [key in `${P}${K}`]?: FacetTypeInterfaces[S[K]] }
      : never
  : never;

type FacetTypeInterfaces = {
  string: {
    limit?: number;
    offset?: number;
    sort?: FacetSorting;
  };
  number: {
    ranges: {from: number, to: number}[]
  };
  boolean: {
    true?: boolean;
    false?: boolean;
  };
}