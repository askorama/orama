import {
  PorterStemmer,
  PorterStemmerNl,
  PorterStemmerFr,
  PorterStemmerEs,
  PorterStemmerIt,
  PorterStemmerPt,
  PorterStemmerSv,
  PorterStemmerRu,
  PorterStemmerNo,
  Stemmer,
} from "natural";

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
  let stemmer: Stemmer;

  switch (language) {
    case "dutch":
      stemmer = PorterStemmerNl;
      break;
    case "english":
      stemmer = PorterStemmer;
      break;
    case "french":
      stemmer = PorterStemmerFr;
      break;
    case "italian":
      stemmer = PorterStemmerIt;
      break;
    case "norwegian":
      stemmer = PorterStemmerNo;
      break;
    case "portugese":
      stemmer = PorterStemmerPt;
      break;
    case "russian":
      stemmer = PorterStemmerRu;
      break;
    case "spanish":
      stemmer = PorterStemmerEs;
      break;
    case "swedish":
      stemmer = PorterStemmerSv;
      break;
    default:
      stemmer = PorterStemmer;
      break;
  }

  return input.map(word => stemmer.stem(word));
}
