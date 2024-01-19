---
outline: deep
---

# Plugin Vitepress

Vitepress is a Vite & Vue powered static site generator.

The website you're visiting right now is built with Vitepress and uses the official Orama Vitepress Plugin for search!

## Installation

You can install the plugin using any major Node.js package manager:

```bash copy 
npm install @orama/plugin-vitepress
```

## Usage

This plugin will look for all the `.md` files in your documentation directory and will automatically index them for you.

After the installation via the package manager of your choice, you can import the plugin in your `.vitepress/config.js` file:

```js
import { OramaPlugin } from '@orama/plugin-vitepress'

export default {
  // ...
  vite: {
    plugins: [OramaPlugin()],
  },
  // ...
}
```

And that's it! The Orama plugin will do the rest for you.
