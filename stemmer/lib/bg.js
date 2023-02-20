/**
 * Light Stemmer for Bulgarian.
 *
 * Converted from the Java implementation of Apache {@link https://github.com/apache/lucene | Lucene}.
 *
 * Implements the algorithm described in: *Searching Strategies for the Bulgarian Language*
 * {@link http://members.unine.ch/jacques.savoy/Papers/BUIR.pdf}
 */
class BulgarianStemmer {
  stem(s) {
    const calculatedLength = this.calculateStemLength(s, s.length);
    return s.substring(0, calculatedLength);
  }

  /**
   * Stem an input buffer of Bulgarian text.
   *
   * @param {string} s input buffer
   * @param {number} len length of input buffer
   * @return {number} length of input buffer after normalization
   */
  calculateStemLength(s, len) {
    if (len < 4) {
      // do not stem
      return len;
    }

    if (len > 5 && this.endsWith(s, len, "ища")) {
      return len - 3;
    }

    len = this.removeArticle(s, len);
    len = this.removePlural(s, len);

    if (len > 3) {
      if (this.endsWith(s, len, "я")) {
        len--;
      }
      if (this.endsWith(s, len, "а") || this.endsWith(s, len, "о") || this.endsWith(s, len, "е")) {
        len--;
      }
    }

    // the rule to rewrite ен -> н is duplicated in the paper.
    // in the perl implementation referenced by the paper, this is fixed.
    // (it is fixed here as well)
    if (len > 4 && this.endsWith(s, len, "ен")) {
      s[len - 2] = "н"; // replace with н
      len--;
    }

    if (len > 5 && s[len - 2] == "ъ") {
      s[len - 2] = s[len - 1]; // replace ъN with N
      len--;
    }

    return len;
    // return s.substring(0, s.length - len);
  }

  /**
   * Mainly remove the definite article
   *
   * @param {string} s input buffer
   * @param {number} len length of input buffer
   * @return {number} new stemmed length
   */
  removeArticle(s, len) {
    if (len > 6 && this.endsWith(s, len, "ият")) return len - 3;

    if (len > 5) {
      if (
        this.endsWith(s, len, "ът") ||
        this.endsWith(s, len, "то") ||
        this.endsWith(s, len, "те") ||
        this.endsWith(s, len, "та") ||
        this.endsWith(s, len, "ия")
      ) {
        return len - 2;
      }
    }

    if (len > 4 && this.endsWith(s, len, "ят")) {
      return len - 2;
    }

    return len;
  }

  /**
   * Remove the plural from the input string
   *
   * @param {string} s input buffer
   * @param {number} len length of input buffer
   * @return {number} new stemmed length
   */
  removePlural(s, len) {
    if (len > 6) {
      if (this.endsWith(s, len, "овци")) return len - 3; // replace with о
      if (this.endsWith(s, len, "ове")) return len - 3;
      if (this.endsWith(s, len, "еве")) {
        s[len - 3] = "й"; // replace with й
        return len - 2;
      }
    }

    if (len > 5) {
      if (this.endsWith(s, len, "ища")) return len - 3;
      if (this.endsWith(s, len, "та")) return len - 2;
      if (this.endsWith(s, len, "ци")) {
        s[len - 2] = "к"; // replace with к
        return len - 1;
      }
      if (this.endsWith(s, len, "зи")) {
        s[len - 2] = "г"; // replace with г
        return len - 1;
      }

      if (s[len - 3] == "е" && s[len - 1] == "и") {
        s[len - 3] = "я"; // replace е with я, remove и
        return len - 1;
      }
    }

    if (len > 4) {
      if (this.endsWith(s, len, "си")) {
        s[len - 2] = "х"; // replace with х
        return len - 1;
      }
      if (this.endsWith(s, len, "и")) return len - 1;
    }

    return len;
  }

  /**
   * Returns true if the character array ends with the suffix.
   * 
   * This is a helper function for the stemmer from the original Java implementation.
   * {@link https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/java/org/apache/lucene/analysis/util/StemmerUtil.java#L68}
   * 
   * @param {string} s Input Buffer
   * @param {number} len length of input buffer
   * @param {string} suffix Suffix string to test
   * @return true if `s` ends with `suffix`
   */
  endsWith(s, len, suffix) {
    let suffixLen = suffix.length;
    if (suffixLen > len) return false;
    for (let i = suffixLen - 1; i >= 0; i--) if (s[len - (suffixLen - i)] != suffix[i]) return false;

    return true;
  }
}

const stemmerInstance = new BulgarianStemmer();

export function stemmer(word) {
  return stemmerInstance.stem(word);
}
