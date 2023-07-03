# Orama Stop-words

This package provides support for stop-words removal in 26 languages:

- Arabic
- Armenian
- Bulgarian
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
- Serbian
- Slovenian
- Spanish
- Swedish
- Tamil
- Turkish
- Ukrainian

```js
import { create } from '@orama/orama'
import { stopwords as italianStopwords } from '@orama/stopwords/italian'

const db = create({
  schema: {
  components: {
    tokenizer: {
      stopwords: italianStopwords
    }
  }
})
```

Read more in the official docs: [https://docs.oramasearch.com/text-analysis/stop-words](https://docs.oramasearch.com/text-analysis/stop-words).

# License

[Apache 2.0](/LICENSE.md)