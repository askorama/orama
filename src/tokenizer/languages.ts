export type Language = typeof SUPPORTED_LANGUAGES[number];

export const SUPPORTED_LANGUAGES = [
  "dutch",
  "english",
  "french",
  "italian",
  "norwegian",
  "portuguese",
  "russian",
  "spanish",
  "swedish",
  "german",
  "finnish",
  "danish",
] as const;
