/*@

  Russian stemming algorithm provided by Dr Martin Porter (snowball.tartarus.org):
  http://snowball.tartarus.org/algorithms/russian/stemmer.html

  Algorithm implementation in PHP provided by Dmitry Koterov (dklab.ru):
  http://forum.dklab.ru/php/advises/HeuristicWithoutTheDictionaryExtractionOfARootFromRussianWord.html

  Algorithm implementation adopted for Drupal by Algenon (4algenon@gmail.com):
  https://drupal.org/project/ukstemmer

  Algorithm implementation in Node by Zakharov Kyrylo
  https://github.com/Amice13

*/

const vowel = new RegExp('[аеиоуюяіїє]')

const perfectiveGround = new RegExp('(?:[иы]в(?:ши(?:сь)?)?|(?<=[ая])(?:в(?:ши(?:сь)?)?))$')

// http://uk.wikipedia.org/wiki/Рефлексивне_дієслово
const reflexive = new RegExp('с[яьи]$')

// http://uk.wikipedia.org/wiki/Прикметник + http://wapedia.mobi/uk/Прикметник
const adjective = new RegExp('(?:[аеєуюя]|еє|ем|єє|ий|их|іх|ів|ій|ім|їй|ім|им|ими|іми|йми|ої|ою|ова|ове|ого|ому)$')

// http://uk.wikipedia.org/wiki/Дієприкметник
const participle = new RegExp('(?:[аіу]|ій|ий|им|ім|их|йми|ого|ому|ою)$')

// http://uk.wikipedia.org/wiki/Дієслово
const verb = new RegExp('(?:[еєую]|ав|али|ати|вши|ив|ити|ме|сь|ся|ши|учи|яти|ячи|ать|ять)$', 'g')

// http://uk.wikipedia.org/wiki/Іменник
const noun = new RegExp(
  '(?:[аеєіїийоуыьюя]|ам|ах|ами|ев|еві|еи|ей|ем|ею|єм|єю|ів|їв|ий|ием|ию|ия|иям|иях|ов|ові|ой|ом|ою|ью|ья|ям|ями|ях)$',
  'g',
)

const derivational = new RegExp('[^аеиоуюяіїє][аеиоуюяіїє]+[^аеиоуюяіїє]+[аеиоуюяіїє].*(?<=о)сть?$', 'g')

const step2 = new RegExp('и$')
const step3 = new RegExp('ость$')
const step41 = new RegExp('ь$')
const step42 = new RegExp('ейше$')
const step43 = new RegExp('нн$')

const alterations = new RegExp('([гджзкстхцчш]|ст|дж|ждж|ьц|сі|ці|зі|он|ін|ів|ев|ок|шк)$')

let thisString

const ukrstemmer = (string, strict = false) => {
  thisString = string.toLowerCase()
  let wordStartIndex = string.match(vowel)
  if (wordStartIndex === null) return string
  wordStartIndex = wordStartIndex.index
  let wordStart = thisString.slice(0, wordStartIndex + 1)
  thisString = thisString.slice(wordStartIndex + 1)
  if (thisString === '') return string

  // Step 1
  if (!replaceAndCheck(thisString, perfectiveGround, '')) {
    replaceAndCheck(thisString, reflexive, '')
    if (replaceAndCheck(thisString, adjective, '')) {
      replaceAndCheck(thisString, participle, '')
    } else {
      if (!replaceAndCheck(thisString, verb, '')) {
        replaceAndCheck(thisString, noun, '')
      }
    }
  }

  // Step 2
  replaceAndCheck(thisString, step2, '')

  // Step 3
  if (derivational.test(thisString)) {
    replaceAndCheck(thisString, step3, '')
  }

  // Step 4
  if (!replaceAndCheck(thisString, step41, '')) {
    replaceAndCheck(thisString, step42, '')
    replaceAndCheck(thisString, step43, 'н')
  }

  if (strict) {
    replaceAndCheck(thisString, alterations, '')
  }

  return wordStart + thisString
}

const replaceAndCheck = (s, from, to) => {
  let original = s
  thisString = s.replace(from, to)
  return thisString !== original
}

export function stemmer(word) {
  return ukrstemmer(word)
}
