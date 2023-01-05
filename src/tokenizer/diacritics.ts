const DIACRITICS_CHARCODE_START = 192;
const DIACRITICS_CHARCODE_END = 252;

const CHARCODE_REPLACE_MAPPING = [
  65,
  65,
  65,
  65,
  65,
  65,
  65,
  67,
  69,
  69,
  69,
  69,
  73,
  73,
  73,
  73,
  null,
  78,
  79,
  79,
  79,
  79,
  79,
  79,
  79,
  85,
  85,
  85,
  85,
  null,
  null,
  null,
  97,
  97,
  97,
  97,
  97,
  97,
  97,
  99,
  101,
  101,
  101,
  101,
  105,
  105,
  105,
  105,
  null,
  110,
  111,
  111,
  111,
  111,
  111,
  111,
  111,
  117,
  117,
  117,
  117,
];

function replaceChar(charCode: number): number {
  if (charCode < DIACRITICS_CHARCODE_START || charCode > DIACRITICS_CHARCODE_END) return charCode;

  /* c8 ignore next  */
  return CHARCODE_REPLACE_MAPPING[charCode - DIACRITICS_CHARCODE_START] || charCode;
}

export function replaceDiacritics(str: string): string {
  const stringCharCode = [];
  for (let idx = 0; idx < str.length; idx++) {
    stringCharCode[idx] = replaceChar(str.charCodeAt(idx));
  }
  return String.fromCharCode(...stringCharCode);
}
