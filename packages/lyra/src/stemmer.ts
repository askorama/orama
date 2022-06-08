import natural from "natural";

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

export function stemArray(input: string[], language: Language): string[] {
  let stemmer;

  switch (language) {
    case "dutch":
      stemmer = natural.PorterStemmerNl;
      break;
    case "english":
      stemmer = natural.PorterStemmer;
      break;
    case "french":
      stemmer = natural.PorterStemmerFr;
      break;
    case "italian":
      stemmer = natural.PorterStemmerIt;
      break;
    case "norwegian":
      stemmer = natural.PorterStemmerNo;
      break;
    case "portugese":
      stemmer = natural.PorterStemmerPt;
      break;
    case "russian":
      stemmer = natural.PorterStemmerRu;
      break;
    case "spanish":
      stemmer = natural.PorterStemmerEs;
      break;
    case "swedish":
      stemmer = natural.PorterStemmerSv;
      break;
    default:
      break;
  }

  if (stemmer) {
    return input.map(stemmer.stem);
  }

  return input;
}
