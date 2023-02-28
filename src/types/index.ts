import type { Language, TokenizerConfig } from "../tokenizer/index.js";
import type { Hooks } from "../methods/hooks.js";
import type { RadixNode } from "../trees/radix/node.js";
import type { AVLNode } from "../trees/avl/node.js";
import { SUPPORTED_PROPERTY_TYPES } from "src/consts.js";

export * from "./filters.js";
export * from "./facets.js";

export type TokenScore = [string, number];
export type Nullable<T> = T | null;

export type IIntersectTokenScores = (arrays: TokenScore[][]) => TokenScore[];

export type ResolveSchema<T extends PropertiesSchema> = {
  [P in keyof T]: ResolveTypes<T[P]>;
};

export type SearchProperties<
  TSchema extends PropertiesSchema,
  TKey extends keyof TSchema = keyof TSchema,
> = TKey extends string
  ? TSchema[TKey] extends PropertiesSchema
    ? `${TKey}.${SearchProperties<TSchema[TKey]>}`
    : TKey
  : never;

export type PropertyType = typeof SUPPORTED_PROPERTY_TYPES[number];

export type PropertiesSchema = {
  [key: string]: PropertyType | PropertiesSchema;
};

export type AlgorithmsConfig = {
  intersectTokenScores: IIntersectTokenScores;
};

export type PropertiesBoost<S extends PropertiesSchema> = {
  [P in keyof S]?: number;
};

export type ElaspedConfig = {
  format?: "human" | "raw",
}

export type Configuration<S extends PropertiesSchema> = {
  /**
   * The structure of the document to be inserted into the database.
   */
  schema: S;
  /**
   * The default language analyzer to use.
   */
  defaultLanguage?: Language;
  edge?: boolean;
  hooks?: Hooks;
  components?: Components;
};

export type Data<S extends PropertiesSchema> = {
  docs: Record<string, ResolveSchema<S> | undefined>;
  defaultLanguage: Language;
  index: Index;
  schema: S;
  frequencies: FrequencyMap;
  tokenOccurrencies: TokenOccurrency;
  avgFieldLength: Record<string, number>;
  fieldLengths: Record<string, Record<string, number>>;
};

export type Components = {
  elapsed?: ElaspedConfig;
  tokenizer?: TokenizerConfig;
  algorithms?: AlgorithmsConfig;
};

export interface Lyra<S extends PropertiesSchema> extends Data<S> {
  defaultLanguage: Language;
  schema: S;
  edge: boolean;
  hooks: Hooks;
  components?: Components;
  frequencies: FrequencyMap;
  docsCount: number;
  avgFieldLength: Record<string, number>;
  fieldLengths: Record<string, Record<string, number>>;
}

export type BM25OptionalParams = {
  k?: number;
  b?: number;
  d?: number;
};

export type BM25Params = {
  k: number;
  b: number;
  d: number;
};

export type TokenMap = Record<string, TokenScore[]>;

export type BooleanIndex = {
  'true': string[];
  'false': string[];
}

type ResolveTypes<TType> = TType extends "string"
  ? string
  : TType extends "boolean"
  ? boolean
  : TType extends "number"
  ? number
  : TType extends PropertiesSchema
  ? { [P in keyof TType]: ResolveTypes<TType[P]> }
  : never;

type Index = Record<string, RadixNode | AVLNode<number, string[]> | BooleanIndex>;

type FrequencyMap = {
  [property: string]: {
    [documentID: string]: {
      [token: string]: number;
    };
  };
};

type TokenOccurrency = {
  [property: string]: {
    [token: string]: number;
  };
};
