---
outline: deep
---

# Stop-words

::: info What are stopwords?
  The words which are generally filtered out before processing a natural language are called **stop words**. These are
  actually the most common words in any language (like articles, prepositions, pronouns, conjunctions, etc) and does not
  add much information to the text. Examples of a few stop words in English are “the”, “a”, “an”, “so”, “what”.
:::

::: warning
Note that as of Orama 1.0.7, stop-words are shipped via a separate `@orama/stopwords` package.
:::

Orama provides support for stop-words removal via the `@orama/stopwords` package.

```bash copy 
npm install @orama/stopwords
```

## Enabling stop-words removal

By default, Orama does not remove any stop-word, as this is intended to be an explicit action from the user. To enable stop-words removal, you can use the `stopWords` property when creating a new Orama instance:

```javascript copy
import { create } from '@orama/orama'

const db = await create({
  schema: {
    author: 'string',
    quote: 'string',
  },
  components: {
    tokenizer: {
      stopWords: ['foo', 'bar'], // Enable custom stop-words
    }
  }
})
```

## Using the default stop-words list

By installing the `@orama/stopwords` package, you can use the default stop-words list for a given language:

```javascript copy
import { create } from '@orama/orama'
import { stopwords as englishStopwords } from '@orama/stopwords/english'

const db = await create({
  schema: {
    author: 'string',
    quote: 'string',
  },
  components: {
    tokenizer: {
      stopWords: englishStopwords,
    }
  }
})
```

Using the default stop-words list is the recommended way to enable stop-words removal, as it is the most efficient way to do so.

## Extending the default stop-words list

You can always extend the default stop-words list by adding or removing words:

```javascript copy
import { create } from '@orama/orama'
import { stopwords as italianStopwords } from '@orama/stopwords/italian'

const db = await create({
  schema: {
    author: 'string',
    quote: 'string',
  },
  components: {
    tokenizer: {
      stopWords: [...italianStopwords, 'ciao', 'buongiorno']
    }
  }
})
```

## Supported languages

As for now, Orama supports 30 languages when it comes to stop-words removal:

- Arabic
- Armenian
- Bulgarian
- Chinese (Mandarin - stemmer not supported)
- Danish
- Dutch
- English
- Finnish
- French
- German
- Greek
- Hindi
- Hungarian
- Indonesian
- Irish
- Italian
- Nepali
- Norwegian
- Portuguese
- Romanian
- Russian
- Sanskrit
- Serbian
- Slovenian
- Spanish
- Swedish
- Tamil 
- Turkish
- Ukrainian