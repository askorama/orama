export declare const STEMMERS: Record<string, string>
export declare const SPLITTERS: Record<Language, RegExp>
export declare const SUPPORTED_LANGUAGES: string[]
export declare function getLocale(language: string | undefined): string | undefined
export type Language = (typeof SUPPORTED_LANGUAGES)[number]
