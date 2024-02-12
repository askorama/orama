# Orama Tokenizers

This package provides support for additional tokenizers for the Orama Search Engine.

Available tokenizers:
- Mandarin
- Japanese (work in progress)
- Korean (work in progress)

Usage:

```js
import init, { tokenize } from '@orama/tokenizes/mandarin'

await init() // Initialize the WebAssembly module

const hmm = true // Use Hidden Markov Model or not (suggested: true)
const tokens = await tokenize('我是一名软件工程师', hmm)

console.log(tokens)
// ["我","是","一名","软件","工程师"]
```

# License
[Apache 2.0](/LICENSE.md)