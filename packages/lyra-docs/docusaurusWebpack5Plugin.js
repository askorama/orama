const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function (context, options) {
  return {
    name: 'custom-docusaurus-webpack-config-plugin',
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          fallback: {
            fs: false,
          },
        },
        plugins: [
          new webpack.DefinePlugin({
            "process.versions.node": JSON.stringify(process.versions.node || "0.0.0"),
          }),
          new NodePolyfillPlugin(),
        ],
      };
    },
  };
};