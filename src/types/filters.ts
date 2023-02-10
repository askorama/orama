import type { PropertiesSchema } from "src/types/index.js";

type ComparisonOperator =
  | { gt?: number; } 
  | { gte?: number; } 
  | { lt?: number; } 
  | { lte?: number; } 
  | { eq?: number; } 
  | { between?: [number, number]; };

export type WhereFilter<
  S extends PropertiesSchema,
  P extends string = "",
  K extends keyof S = keyof S> = K extends string
  ? S[K] extends PropertiesSchema
    ? WhereFilter<S[K], `${P}${K}.`>
    : S[K] extends "number"
      ? { [key in `${P}${K}`]?: ComparisonOperator }
      : never
  : never;
