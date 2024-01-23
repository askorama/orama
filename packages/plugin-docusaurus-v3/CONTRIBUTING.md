# Contributing

## Project structure

### The `src` folder

In the `src` directory there is the source code of the plugin to be modified.

As any other Docusaurus plugin, there is a division between the `server` and the `client` parts of the plugin.

The `server` part implements the generation of the JSON index at build time, reading the documentation content through each produced HTML file.

The `client` part implements the React component that will be shown to the user once docusaurus is up and running.

### The `example-doc` folder

In the `example-doc` directory there is a generated docusaurus instance with the plugin already configured.

During development, you don't have to build anything to make it loadable, as it is loaded by the Webpack instance of Docusaurus.
