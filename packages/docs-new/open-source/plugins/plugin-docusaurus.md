---
outline: deep
---

# Docusaurus Plugin

The plugin-docusaurus plugin allows you to index the content of your Docusaurus websites and offer text search to your visitors.

## Pre-requisites
In order guarantee a correct functionality of the plugin, you need to have the `@docusaurus/core` at least in the version `2.4.3`.

::: warning
This plugin do not support Docusaurus v3
:::

## Installation

You can install the plugin using any major Node.js package manager:

```bash copy 
npm install @orama/plugin-docusaurus
```

## Usage

Add the plugin to your `docusaurus.config.js`:

```js
{
  // ...
  plugins: ["@orama/plugin-docusaurus"],
  // ...
}
```