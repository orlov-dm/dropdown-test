const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          { 
            loader: 'style-loader' 
          },
          { 
            loader: 'css-loader',
            options:
            {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300 // The default
  }
};