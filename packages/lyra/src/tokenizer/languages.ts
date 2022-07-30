export type Language = typeof SUPPORTED_LANGUAGES[number];

export const SUPPORTED_LANGUAGES = [
  "dutch",
  "english",
  "french",
  "italian",
  "norwegian",
  "portugese",
  "russian",
  "spanish",
  "swedish",
] as const;
