---
outline: deep
---

# Docusaurus Plugin

The docusaurus plugin allows you to index the content of your Docusaurus websites and offer text search to your visitors.
This plugin can be used in OSS mode where you host the documents, or in cloud mode where your data will be stored by us and you will have access to analytics where you can see the number of queries and much more.

## Pre-requisites

In order guarantee a correct functionality of the plugin, you need to have the `@docusaurus/core` at least in the version `3.0.0`.

::: warning
This plugin do not support Docusaurus v2. Use [`@orama/plugin-docusaurus`](https://www.npmjs.com/package/@orama/plugin-docusaurus) instead.
:::

## Installation

You can install the plugin using any major Node.js package manager:

```bash copy
npm install @orama/plugin-docusaurus-v3
```

```bash copy
pnpm install @orama/plugin-docusaurus-v3
```

```bash copy
yarn add @orama/plugin-docusaurus-v3
```

## Usage

### With Orama OSS

Add the plugin to your `docusaurus.config.js`:

```js
{
  // ...
  plugins: ["@orama/plugin-docusaurus-v3"],
  // ...
}
```

And that's it, you now have a search that will update whenever you build your site.

### With Orama Cloud

If you want to use Orama Cloud as the source so you can have access to analytics for free you need a couple more variables:

```js
// ...
plugins: [
  [
    "@orama/plugin-docusaurus-v3",
    {
      cloud: {
        indexId: process.env.ORAMA_CLOUD_INDEX_ID, // Env variable suggested
        oramaCloudAPIKey: process.env.ORAMA_CLOUD_API_KEY, // Env variable suggested
        deploy: true, // Enables deploy while building/starting
      },
    },
  ],
];
// ...
```

To get this variables first create a new integration for HTTP Integrations in here:

![select integrations](/oss/docussarus-1.png)

And then docussarus:

![select Docussarus](/oss/docussarus-2.png)

And you are set, if you set deploy to true your index will update whenever you build the website and there are changes to your pages.
