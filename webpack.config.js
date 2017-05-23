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
  devServer: {
    publicPath: '/compiled/',
    contentBase: __dirname + '/client/public',
  }
}
