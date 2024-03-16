---
outline: deep
---

# Docusaurus Plugin

The `@orama/plugin-docusaurus` plugin is a powerful tool that allows you to index the content of your Docusaurus websites and offer text search functionality to your visitors. It is designed to work seamlessly with Docusaurus, a popular static site generator for building documentation websites.

## Pre-requisites

To ensure the correct functionality of the plugin, you need to have the `@docusaurus/core` installed and at least version `2.4.3`.

::: warning
This plugin does not support Docusaurus v3 at the moment.
:::

## Installation

You can install the plugin using any major Node.js package manager:

```bash copy
npm install @orama/plugin-docusaurus
```

## Usage

To use the plugin, you need to add it to your `docusaurus.config.js` file:

```js
{
  // ...
  plugins: ["@orama/plugin-docusaurus"],
  // ...
}
```

## Core Functions

The `@orama/plugin-docusaurus` plugin exposes several core functions to handle different aspects of the indexing and search process.

### `OramaPluginDocusaurus` Function

The `OramaPluginDocusaurus` function is the main exported function that is used to create and configure the Orama Docusaurus plugin. It takes an object as input, containing the site directory and the generated files directory.

```typescript
export default function OramaPluginDocusaurus(ctx: { siteDir: any; generatedFilesDir: any }): Plugin {
  // Plugin implementation
}
```

This function returns a Docusaurus plugin instance, which can be used to integrate the plugin with your Docusaurus project.

### `buildDevSearchData` Function

The `buildDevSearchData` function is responsible for building the search data during development. It takes the site directory, generated files directory, all content, and the current version as arguments.

```typescript
async function buildDevSearchData(siteDir: string, generatedFilesDir: string, allContent: any, version: string) {
  // Function implementation
}
```

This function is used to generate the search index file, which is essential for providing the text search functionality on your Docusaurus website.

### `generateDocs` Function

The `generateDocs` function is used to generate the document content for indexing. It takes the site directory and an object containing the title, permalink, and source of the document as arguments.

```typescript
async function generateDocs(siteDir: string, { title, permalink, source }: Record<string, string>) {
  // Function implementation
}
```

This function is responsible for parsing the document content and preparing it for indexing, ensuring that the search functionality can accurately retrieve relevant information.

### `parseHTMLContent` Function

The `parseHTMLContent` function is responsible for parsing the HTML content and splitting it into sections for indexing. It takes an object containing the HTML content, the path, and the original title as arguments.

```typescript
function parseHTMLContent({ html, path, originalTitle }: { html: any; path: any; originalTitle: any }) {
  // Function implementation
}
```

This function ensures that the search index includes not only the full document content but also individual sections, allowing for more granular search results.

### `indexPath` Function

The `indexPath` function generates the file path for the search index file. It takes the output directory and the current version as arguments.

```typescript
function indexPath(outDir: string, version: string) {
  // Function implementation
}
```

This function is used to ensure that the search index file is properly named and located within your Docusaurus project, enabling the search functionality to work correctly.

By leveraging these core functions, the `@orama/plugin-docusaurus` plugin provides a seamless way to index your Docusaurus website content and offer a robust text search experience to your visitors.

  
  
