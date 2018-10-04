const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const postcssCustomProperties = require('postcss-custom-properties');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
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
          { 
            loader: 'postcss-loader', 
            options: {
              config: {
                path: __dirname + '/postcss.config.js'
              }
            },
            // options: {
            //   ident: 'postcss',
            //   plugins: () => [
            //     postcssPresetEnv(/* pluginOptions */),
            //     postcssCustomProperties(/* pluginOptions */),                
            //   ]
            // } 
          }
        ]
      },      
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  watchOptions: {
    aggregateTimeout: 300 // The default
  },
  devtool: "source-map",
  /*plugins: [
  ]*/
};