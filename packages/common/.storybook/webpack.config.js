const path = require('path');

module.exports = async ({config}) => {
  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    use: {
      loader: 'babel-loader',
      options: {
        // Disable reading babel configuration
        babelrc: false,
        configFile: false,
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-flow',
          '@babel/preset-typescript',
        ],
      },
    },
  });

  return config;
}