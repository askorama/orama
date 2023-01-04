import { IIntersectTokenScores, Language, TokenizerConfig, TokenScore } from "@lyrasearch/components";
import type { Hooks } from "./methods/hooks.js";
import type { Node } from "./radix-tree/node.js";

export type Nullable<T> = T | null;

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

export type PropertyType = "string" | "number" | "boolean";

export type PropertiesSchema = {
  [key: string]: PropertyType | PropertiesSchema;
};

export type AlgorithmsConfig = {
  intersectTokenScores: IIntersectTokenScores | Promise<IIntersectTokenScores>;
};

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
  index: Index;
  schema: S;
  frequencies: FrequencyMap;
  tokenOccurrencies: TokenOccurrency;
};

export type Components = {
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

type Index = Record<string, Node>;

export type TokenMap = Record<string, TokenScore[]>;

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
