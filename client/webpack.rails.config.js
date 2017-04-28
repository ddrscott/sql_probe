const config = require('./webpack.common.config');
config.output = {
  filename: 'client-bundle.js',
  path: '../app/assets/javascripts/sql_probe/generated'
};

config.module.loaders.push(
  {test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader'},
  {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
);

module.exports = config;
