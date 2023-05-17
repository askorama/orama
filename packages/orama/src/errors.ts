import { SUPPORTED_LANGUAGES } from './components/tokenizer/languages.js'
import { sprintf } from './utils.js'

const allLanguages = SUPPORTED_LANGUAGES.join('\n - ')

const errors = {
  NO_LANGUAGE_WITH_CUSTOM_TOKENIZER: 'Do not pass the language option to create when using a custom tokenizer.',
  LANGUAGE_NOT_SUPPORTED: `Language "%s" is not supported.\nSupported languages are:\n - ${allLanguages}`,
  INVALID_STEMMER_FUNCTION_TYPE: `config.stemmer property must be a function.`,
  MISSING_STEMMER: `As of version 1.0.0 @orama/orama does not ship non English stemmers by default. To solve this, please explicitly import and specify the "%s" stemmer from the package @orama/stemmers. See https://docs.oramasearch.com/text-analysis/stemming for more information.`,
  CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY: 'Custom stop words array must only contain strings.',
  UNSUPPORTED_COMPONENT: `Unsupported component "%s".`,
  COMPONENT_MUST_BE_FUNCTION: `The component "%s" must be a function.`,
  COMPONENT_MUST_BE_FUNCTION_OR_ARRAY_FUNCTIONS: `The component "%s" must be a function or an array of functions.`,
  INVALID_SCHEMA_TYPE: `Unsupported schema type "%s". Expected "string", "boolean" or "number".`,
  DOCUMENT_ID_MUST_BE_STRING: `Document id must be of type "string". Got "%s" instead.`,
  DOCUMENT_ALREADY_EXISTS: `A document with id "%s" already exists.`,
  DOCUMENT_DOES_NOT_EXIST: `A document with id "%s" does not exists.`,
  MISSING_DOCUMENT_PROPERTY: `Missing searchable property "%s".`,
  INVALID_DOCUMENT_PROPERTY: `Invalid document property "%s": expected "%s", got "%s"`,
  UNKNOWN_INDEX: `Invalid property name "%s". Expected a wildcard string ("*") or array containing one of the following properties: %s`,
  INVALID_BOOST_VALUE: `Boost value must be a number greater than, or less than 0.`,
  INVALID_FILTER_OPERATION: `You can only use one operation per filter, you requested %d.`,
  INVALID_SYNONYM_KIND: `Invalid synonym kind. Expected one of the following: %s, but got: %s.`
}

export type ErrorCode = keyof typeof errors

export interface OramaError extends Error {
  code: string
}

export function createError(code: ErrorCode, ...args: Array<string | number>): OramaError {
  const error = new Error(sprintf(errors[code] ?? `Unsupported Orama Error code: ${code}`, ...args)) as OramaError
  error.code = code
  if ('captureStackTrace' in Error.prototype) {
    Error.captureStackTrace(error)
  }

  return error
}
