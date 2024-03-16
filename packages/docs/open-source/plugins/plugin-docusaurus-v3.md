
  
  Here's the updated documentation with the necessary changes to reflect support for Docusaurus 3:

---
outline: deep
---

# Docusaurus Plugin

The plugin-docusaurus plugin allows you to index the content of your Docusaurus websites and offer text search to your visitors.

## Pre-requisites
In order to guarantee the correct functionality of the plugin, you need to have `@docusaurus/core` version 3.0.0 or later.

## Installation

You can install the plugin using any major Node.js package manager:

```bash copy
npm install @orama/plugin-docusaurus-v3
```

## Usage

Add the plugin to your `docusaurus.config.js`:

```js
{
  // ...
  plugins: ["@orama/plugin-docusaurus-v3"],
  // ...
}
```

To configure the plugin, you can pass an options object to it:

```js
{
  // ...
  plugins: [
    [
      "@orama/plugin-docusaurus-v3",
      {
        // Plugin options go here
      },
    ],
  ],
  // ...
}
```

The available options for the plugin are:

- `siteDir`: The directory path of your Docusaurus site.
- `generatedFilesDir`: The directory path where the plugin should store generated files.

For example:

```js
{
  // ...
  plugins: [
    [
      "@orama/plugin-docusaurus-v3",
      {
        siteDir: path.join(__dirname, ".."), // Assuming the config is in the website/ directory
        generatedFilesDir: path.join(__dirname, "..", "generated-files"),
      },
    ],
  ],
  // ...
}
```

With the plugin added and configured, your Docusaurus site will now be indexed by Orama, enabling text search functionality for your visitors.
  
  