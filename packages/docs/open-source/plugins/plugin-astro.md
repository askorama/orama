---
outline: deep
---

# Astro plugin

The plugin-astro plugin allows you to index the content of your Astro websites and offer text search to your visitors.

## Installation

You can install the plugin using any major Node.js package manager:

```sh
npm i @orama/plugin-astro
```

## Usage

There are two main aspects to consider when using this plugin:

- DB generation
- Loading DBs & performing searches

```javascript copy
// In `astro.config.mjs`
import orama from '@orama/plugin-astro'

// https://astro.build/config
export default defineConfig({
  integrations: [
    orama({
      // We can generate more than one DB, with different configurations
      mydb: {
        // Required. Only pages matching this path regex will be indexed
        pathMatcher: /blog\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/.+$/,

        // Optional. 'english' by default
        language: 'spanish',

        // Optional. ['body'] by default. Use it to constraint what is used to
        // index a page.
        contentSelectors: ['h1', 'main'],
      },
    }),
  ],
})
```

When running the `astro build` command, a new DB file will be persisted in the `dist/assets` directory. For the particular case of this example, it will be saved in the file `dist/assets/oramaDB_mydb.json`.

### Local development

Running Astro with `astro dev` does not [bundle the assets](https://docs.astro.build/en/reference/cli-reference/#astro-dev), including Orama's DBs, causing a "404 - not found" error when trying to load them.

In order to use Orama in local Astro development, you can run `astro build` to build your project and then `astro preview` to [serve the built files](https://docs.astro.build/en/reference/cli-reference/#astro-preview) in the `dist/` folder.

## Loading the DB on client-side

To use the generated DBs in your pages, you can include a script in your `<head>` section, as the following one:

```html copy
<head>
  <!-- Other stuff -->
  <script>
    // Astro will do the job of bundling everything for you
    import { getOramaDB, search } from "@orama/plugin-astro/client"

    // We load the DB that we generated at build time, this is an asynchronous
    // operation, so we must either await, or rely on `.then` calls.
    const db = await getOramaDB('mydb')

    // Now we can search inside our DB. Of course, feel free to use it in more
    // interesting ways.
    console.log('Search Results')
    console.log(await search(db, { term: 'mySearchTerm' }))
  </script>
</head>
```

For now, the plugin only expose load & search functionality on the client side, but we might expose other Orama features as soon as we stabilise some internal details and public APIs.