---
outline: deep
---

# Officially Supported Languages

Right now, Orama supports 30 languages out of the box in 8 different alphabets. \
For every language, Orama provides a default tokenizer, stop-words, and stemmer.

::: tip 🇨🇳🇯🇵 A note on Chinese and Japanese
At the time of writing, Chinese (Mandarin) and Japanese are the only exception, since Orama provides everything by default but the stemmer.

Since Chinese and Japanese logograms follow different rules than other alphabets, you will need to import a dedicated tokenizer for it.

Read more here about Chinese [here](/open-source/supported-languages/using-chinese-with-orama.html) and about Japanese [here](/open-source/supported-languages/using-japanese-with-orama.html).
:::

### Latin Alphabet

| Language     | Tokenizer | Stop-words | Stemmer |
| ------------ | --------- | ---------- | --------|
| Danish       | ✅        | ✅          | ✅      |
| Dutch        | ✅        | ✅          | ✅      |
| English      | ✅        | ✅          | ✅      |
| Finnish      | ✅        | ✅          | ✅      |
| French       | ✅        | ✅          | ✅      |
| German       | ✅        | ✅          | ✅      |
| Hungarian    | ✅        | ✅          | ✅      |
| Indonesian   | ✅        | ✅          | ✅      |
| Irish        | ✅        | ✅          | ✅      |
| Italian      | ✅        | ✅          | ✅      |
| Norwegian    | ✅        | ✅          | ✅      |
| Portuguese   | ✅        | ✅          | ✅      |
| Romanian (*) | ✅        | ✅          | ✅      |
| Serbian (**) | ✅        | ✅          | ✅      |
| Slovenian    | ✅        | ✅          | ✅      |
| Spanish      | ✅        | ✅          | ✅      |
| Swedish      | ✅        | ✅          | ✅      |
| Turkish      | ✅        | ✅          | ✅      |

(*) = also uses a few additional diacritic marks \
(**) = uses both Cyrillic and Latin scripts

### Cyrillic Alphabet

| Language     | Tokenizer | Stop-words | Stemmer |
| ------------ | --------- | ---------- | --------|
| Bulgarian    | ✅        | ✅          | ✅      |
| Russian      | ✅        | ✅          | ✅      |
| Serbian (*)  | ✅        | ✅          | ✅      |
| Ukrainian    | ✅        | ✅          | ✅      |

(*) = uses both Cyrillic and Latin scripts

### Greek Alphabet

| Language     | Tokenizer | Stop-words | Stemmer |
| ------------ | --------- | ---------- | --------|
| Greek        | ✅        | ✅          | ✅      |

### Devanagari Script

| Language     | Tokenizer | Stop-words | Stemmer |
| ------------ | --------- | ---------- | --------|
| Hindi        | ✅        | ✅          | ✅      |
| Nepali       | ✅        | ✅          | ✅      |
| Sanskrit     | ✅        | ✅          | ✅      |

### Arabic Script

| Language     | Tokenizer | Stop-words | Stemmer |
| ------------ | --------- | ---------- | --------|
| Arabic       | ✅        | ✅          | ✅      |

### Armenian Alphabet

| Language     | Tokenizer | Stop-words | Stemmer |
| ------------ | --------- | ---------- | --------|
| Armenian     | ✅        | ✅          | ✅      |

### Tamil Script

| Language     | Tokenizer | Stop-words | Stemmer |
| ------------ | --------- | ---------- | --------|
| Tamil        | ✅        | ✅          | ✅      |

### Chinese Characters (Logographic Script)

| Language               | Tokenizer | Stop-words | Stemmer |
| ---------------------- | --------- | ---------- | --------|
| Chinese (Mandarin)     | ✅        | ✅          | ❌      |
| Japanese               | ✅        | ✅          | ❌      |