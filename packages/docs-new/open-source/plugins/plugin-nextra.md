# Plugin Nextra

[Nextra](https://nextra.site) is a static site generator for Next.js, which provides an easy and effective way to create a blog or a documentation website.
The website you're visiting right now is built with Nextra!

Orama provides its own official plugin to be integrated with Nextra.

## Installation

You can install the plugin using any major Node.js package manager:

```bash copy 
npm install @orama/plugin-nextra
```

## Usage

This plugin takes advantage of the built-in Nextra API to automatically generate the search index depending on the current locale. Therefore, multiple locales are supported out of the box.

After the installation via the package manager of your choice, you can import the plugin in your `theme.config.jsx` file:

```js
import { OramaSearch } from '@orama/plugin-nextra'

export default {
  // ...
  search: {
    component: OramaSearch,
  },
  // ...
}
```

And that's it! The Orama plugin will do the rest for you.