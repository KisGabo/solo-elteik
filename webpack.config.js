const BabiliPlugin = require("babili-webpack-plugin")

module.exports = {
  entry: __dirname + '/client/main.js',
  output: {
    filename: '_webpack.js',
    path: __dirname + '/client/public/compiled',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [ __dirname + '/client' ],
        loaders: ['babel'],
      }
    ],
  },
  plugins: [
    new BabiliPlugin()
  ],
  devServer: {
    publicPath: '/compiled/',
    contentBase: __dirname + '/client/public',
  }
}
