/* eslint-disable node/no-missing-import */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/**
 * Custom config file for testing purposes
 */

import { defineConfig } from 'astro/config'
import orama from '@orama/plugin-astro'

// https://astro.build/config
export default defineConfig({
  integrations: [
    orama({
      animals: { pathMatcher: /animals_.+$/ },
      games: { pathMatcher: /games_.+$/ }
    })
  ],
  trailingSlash: 'always'
})
