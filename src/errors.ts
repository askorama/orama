import { SUPPORTED_LANGUAGES } from "./tokenizer/languages.js";
import { sprintf } from "./utils.js";

export type ErrorCode =
  | "NO_DEFAULT_LANGUAGE_WITH_CUSTOM_TOKENIZER"
  | "LANGUAGE_NOT_SUPPORTED"
  | "INVALID_STEMMER_FUNCTION_TYPE"
  | "CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY"
  | "UNSUPPORTED_COMPONENT"
  | "COMPONENT_MUST_BE_FUNCTION"
  | "COMPONENT_MUST_BE_FUNCTION_OR_ARRAY_FUNCTIONS"
  | "INVALID_SCHEMA_TYPE"
  | "TYPE_ERROR_ID_MUST_BE_STRING"
  | "DOCUMENT_ID_MUST_BE_STRING"
  | "DOCUMENT_ALREADY_EXISTS"
  | "DOCUMENT_DOES_NOT_EXIST"
  | "MISSING_DOCUMENT_PROPERTY"
  | "INVALID_DOCUMENT_PROPERTY"
  | "INVALID_BOOST_VALUE"
  | "UNKNOWN_INDEX"
  | "INVALID_FILTER_OPERATION";

export interface LyraError extends Error {
  code: string;
}

export function createError(code: ErrorCode, ...args: Array<string | number>): LyraError {
  let message = "";

  switch (code) {
    case "NO_DEFAULT_LANGUAGE_WITH_CUSTOM_TOKENIZER":
      message = "Do not pass the defaultLanguage option to create when using a custom tokenizer.";
      break;
    case "LANGUAGE_NOT_SUPPORTED":
      message = `Language "%s" is not supported.\nSupported languages are:\n - ${SUPPORTED_LANGUAGES.join("\n - ")}`;
      break;
    case "INVALID_STEMMER_FUNCTION_TYPE":
      message = `config.stemmer property must be a function.`;
      break;
    case "CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY":
      message = "Custom stop words array must only contain strings.";
      break;
    case "UNSUPPORTED_COMPONENT":
      message = `Unsupported component "%s".`;
      break;
    case "COMPONENT_MUST_BE_FUNCTION":
      message = `The component "%s" must be a function.`;
      break;
    case "COMPONENT_MUST_BE_FUNCTION_OR_ARRAY_FUNCTIONS":
      message = `The component "%s" must be a function or an array of functions.`;
      break;
    case "INVALID_SCHEMA_TYPE":
      message = `Unsupported schema type "%s". Expected "string", "boolean" or "number".`;
      break;
    case "DOCUMENT_ID_MUST_BE_STRING":
      message = `Document id must be of type "string". Got "%s" instead.`;
      break;
    case "DOCUMENT_ALREADY_EXISTS":
      message = `A document with id "%s" already exists.`;
      break;
    case "DOCUMENT_DOES_NOT_EXIST":
      message = `A document with id "%s" does not exists.`;
      break;
    case "MISSING_DOCUMENT_PROPERTY":
      message = `Missing searchable property "%s".`;
      break;
    case "INVALID_DOCUMENT_PROPERTY":
      message = `Invalid document property "%s": expected "%s", got "%s"`;
      break;
    case "UNKNOWN_INDEX":
      message = `Invalid property name "%s". Expected a wildcard string ("*") or array containing one of the following properties: %s`;
      break;
    case "INVALID_BOOST_VALUE":
      message = `Boost value must be a number greater than, or less than 0.`;
      break;
    case "INVALID_FILTER_OPERATION":
      message = `You can only use one operation per filter, you requested %d.`;
      break;
    default:
      message = `Unsupported Lyra Error code: ${code}`;
      break;
  }

  const error = new Error(sprintf(message, ...args)) as LyraError;
  error.code = code;
  if ("captureStackTrace" in Error.prototype) {
    Error.captureStackTrace(error);
  }

  return error;
}
