const path = require('path');

const licenseConfig = require('../../policy/licenses-webpack-config');
const LicenseWebpackPlugin =
  require('license-webpack-plugin').LicenseWebpackPlugin;

const StringReplacePlugin = require('string-replace-webpack-plugin');

require('dotenv').config();
const { NODE_ENV = 'production' } = process.env;
const minimize = NODE_ENV !== 'development';
console.log(`Build mode: ${NODE_ENV}`);

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
      {
        enforce: 'pre',
        test: /unicode-properties[\/\\]unicode-properties/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: "var fs = _interopDefault(require('fs'));",
              replacement: function () {
                return "var fs = require('fs');";
              },
            },
          ],
        }),
      },
      {
        test: /unicode-properties[\/\\]unicode-properties/,
        loader: 'transform-loader?brfs',
      },
      { test: /pdfkit[/\\]js[/\\]/, loader: 'transform-loader?brfs' },
      { test: /fontkit[\/\\]index.js$/, loader: 'transform-loader?brfs' },
      {
        test: /linebreak[\/\\]src[\/\\]linebreaker.js/,
        loader: 'transform-loader?brfs',
      },
    ],
  },
  optimization: {
    minimize,
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'unicode-properties': 'unicode-properties/unicode-properties.cjs.js',
      pdfkit: 'pdfkit/js/pdfkit.js',
    },
  },
  plugins: [
    ...licenseConfig.plugins(LicenseWebpackPlugin),
    new StringReplacePlugin(),
  ],
};
