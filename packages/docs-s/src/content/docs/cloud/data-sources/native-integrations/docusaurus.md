---
title: Connect Orama Cloud to Docusaurus
---

## Pre-requisites

In order guarantee a correct functionality of the plugin, you need to have the `@docusaurus/core` at least in the version `3.2.0`.

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

To use the plugin you will need to add it to your docusaurus list of plugins:

```js
// ...
plugins: [
  [
    "@orama/plugin-docusaurus-v3",
    {
      cloud: {
        indexId: "<your_orama_index_id>",
        oramaCloudAPIKey: process.env.ORAMA_CLOUD_API_KEY, // Env variable suggested
        deploy: true, // Enables deploy while building/starting
      },
    },
  ],
];
// ...
```

To get this variables first create a new integration for HTTP Integrations in here:

<ZoomImg
  src='/oss/docussarus-1.png'
  alt='select integrations'
/>

And then docusaurus:

<ZoomImg
  src='/oss/docussarus-2.png'
  alt='Select Docusaurus'
/>

On the next page you will see all the variables you need to get you up and running:

<ZoomImg
  src='/oss/docussarus-3.png'
  alt="the variables"
/>

And you are set, if you set deploy to true your index will update whenever you build the website and there are changes to your pages.
