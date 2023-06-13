# Orama Sto-words

Orama removes common stop-words for you, depending on the language parameter used during new instance creation.
Right now, Orama supports 26 languages and stemmers out of the box:

As for now, Orama supports 12 languages when it comes to stop-words removal:

- English
- Italian
- French
- Spanish
- Portugaise
- Dutch
- Swedish
- Russian
- Norwegian
- German
- Danish
- Finnish

```js
import { create } from '@orama/orama'
import { stopwords } from '@orama/stopwords/italian'

const db = create({
  schema: {
  components: {
    tokenizer: {
      stopWords
    }
  }
})
```

Read more in the official docs: [https://docs.oramasearch.com/text-analysis/stop-words](https://docs.oramasearch.com/text-analysis/stop-words).

# License

[Apache 2.0](/LICENSE.md)