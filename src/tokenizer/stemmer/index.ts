import type { Language } from "../languages";
import { stemmer as AMStemmer } from "./am";
import { stemmer as ARStemmer } from "./ar";
import { stemmer as DEStemmer } from "./de";
import { stemmer as DKStemmer } from "./dk";
import { stemmer as ESSTemmer } from "./es";
import { stemmer as FIStemmer } from "./fi";
import { stemmer as FRStemmer } from "./fr";
import { stemmer as GRStemmer } from "./gr";
import { stemmer as HUStemmer } from "./hu";
import { stemmer as IDStemmer } from "./id";
import { stemmer as IEStemmer } from "./ie";
import { stemmer as INStemmer } from "./in";
import { stemmer as ITStemmer } from "./it";
import { stemmer as LTStemmer } from "./lt";
import { stemmer as NLStemmer } from "./nl";
import { stemmer as NOStemmer } from "./no";
import { stemmer as NPStemmer } from "./np";
import { stemmer as PTStemmer } from "./pt";
import { stemmer as ROStemmer } from "./ro";
import { stemmer as RSStemmer } from "./rs";
import { stemmer as RUStemmer } from "./ru";
import { stemmer as SEStemmer } from "./se";
import { stemmer as TRStemmer } from "./tr";
import { stem as ENStemmer } from "./en";

export type Stemmer = (word: string) => string;

type StemmerMap = {
  [key in Language]: Stemmer;
};

export const stemmers: Partial<StemmerMap> = {
  armenian: AMStemmer,
  arabic: ARStemmer,
  german: DEStemmer,
  danish: DKStemmer,
  english: ENStemmer,
  spanish: ESSTemmer,
  finnish: FIStemmer,
  french: FRStemmer,
  greek: GRStemmer,
  hungarian: HUStemmer,
  indonesian: IDStemmer,
  irish: IEStemmer,
  indian: INStemmer,
  italian: ITStemmer,
  lithuanian: LTStemmer,
  dutch: NLStemmer,
  norwegian: NOStemmer,
  nepali: NPStemmer,
  portuguese: PTStemmer,
  romanian: ROStemmer,
  serbian: RSStemmer,
  russian: RUStemmer,
  swedish: SEStemmer,
  turkish: TRStemmer,
};

export const availableStemmers = Object.keys(stemmers);
