const path = require('path');

module.exports = {
  entry: './md5.js',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: { inline: true }
        }
      }
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  output: {
    filename: '[name].worker.js',
    path: path.resolve(__dirname, 'dist'),
  },
};