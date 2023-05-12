# Orama Stemmers

Orama can analyze the input and perform a `stemming` operation, which allows the engine to perform more optimized queries, as well as save indexing space.

Right now, Orama supports 26 languages and stemmers out of the box:

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
- Turkish
- Ukrainian

```js
import { create } from '@orama/orama'
import { stemmer } from '@orama/stemmers/italian'

const db = create({
  schema: {
  components: {
    tokenizer: {
      stemming: true,
      stemmer
    }
  }
})
```

Read more in the official docs: [https://docs.oramasearch.com/text-analysis/stemming](https://docs.oramasearch.com/text-analysis/stemming).

# License

[Apache 2.0](/LICENSE.md)