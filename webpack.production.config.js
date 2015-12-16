var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'client/client.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new ExtractTextPlugin("app.css")
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [node_modules_dir],
        loader: 'babel-loader'
      }
    ]
  }
};
