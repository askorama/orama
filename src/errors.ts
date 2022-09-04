import { SUPPORTED_LANGUAGES } from "./tokenizer/languages";

function formatJSON(input: object) {
  return JSON.stringify(input, null, 2);
}

export function INVALID_SCHEMA_TYPE(type: string): string {
  return `Invalid schema type. Expected string or object, but got ${type}`;
}

export function INVALID_DOC_SCHEMA(expected: object, found: object): string {
  return `Invalid document structure. \nLyra has been initialized with the following schema: \n\n${formatJSON(
    expected,
  )}\n\nbut found the following doc:\n\n${formatJSON(found)}`;
}

export function INVALID_PROPERTY(name: string, expected: string[]): string {
  return `Invalid property name. Expected a wildcard string ("*") or array containing one of the following properties: ${expected.join(
    ", ",
  )}, but got: ${name}`;
}

export function CANT_DELETE_DOC_NOT_FOUND(id: string): string {
  return `Document with ID ${id} does not exist.`;
}

export function CANT_DELETE_DOCUMENT(docID: string, key: string, token: string): string {
  return `Unable to delete document "${docID}" from index "${key}" on word "${token}".`;
}

export function UNSUPPORTED_NESTED_PROPERTIES(): string {
  return `Nested properties are not supported in this Lyra version, but will be in the future.`;
}

export function DOC_ID_DOES_NOT_EXISTS(id: string): string {
  return `Document with ID ${id} does not exists`;
}

export function LANGUAGE_NOT_SUPPORTED(lang: string): string {
  return `Language "${lang}" is not supported.\nSupported languages are:\n - ${SUPPORTED_LANGUAGES.join("\n - ")}`;
}

export function GETTER_SETTER_WORKS_ON_EDGE_ONLY(method: string): string {
  return `${method} works on edge only. Use edge: true in Lyra constructor to enable it.`;
}

export function RESERVED_PROPERTY_NAME(name: string): string {
  return `"${name}" is a reserved property name. Please change it to "__${name}", "${name}__", "_${name}_", or similar.`;
}

export function INVALID_HOOKS_OBJECT(): string {
  return "Invalid hooks object";
}

export function NON_SUPPORTED_HOOKS(invalidHooks: string[]): string {
  return `The following hooks aren't supported. Hooks: ${invalidHooks}`;
}

export function CUSTOM_STOP_WORDS_ARRAY_MUST_BE_STRING_ARRAY(): string {
  return `Custom stop words array must only contain strings.`;
}

export function CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY(): string {
  return `Custom stop words must be a function or an array of strings.`;
}

export function INVALID_STEMMER_FUNCTION_TYPE(): string {
  return `tokenizer.stemmingFn property must be a function.`;
}

export function INVALID_TOKENIZER_FUNCTION(): string {
  return `tokenizer.tokenizerFn must be a function.`;
}
