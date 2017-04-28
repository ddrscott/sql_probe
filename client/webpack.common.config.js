const path = require('path');
module.exports = {
  context: __dirname,
  entry: ['./src/index.js'],

  resolve: {
    root: [path.join(__dirname, 'src')],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.config.js']
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  }
}
