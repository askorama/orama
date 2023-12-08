/**
 * Light Stemmer class for Sanskrit
 */

class SanskritStemmer {
  constructor() {
    this.suffixes = [
      'aḥ',
      'āḥ',
      'iḥ',
      'īḥ',
      'uḥ',
      'ūḥ',
      'am',
      'ām',
      'im',
      'īm',
      'um',
      'ūm',
      'an',
      'ān',
      'in',
      'īn',
      'un',
      'ūn',
      'as',
      'ās',
      'is',
      'īs',
      'us',
      'ūs'
    ]
  }

  stem(word) {
    for (const suffix of this.suffixes) {
      if (word.endsWith(suffix)) {
        return word.slice(0, -suffix.length)
      }
    }

    return word
  }
}

const stemmerInstance = new SanskritStemmer()

export function stemmer(word) {
  return stemmerInstance.stem(word)
}
