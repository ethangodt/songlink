var config = require('../webpack.development.config');
var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var bodyParser = require('body-parser');
var youtube = require('./providerModules/youtube.js')

var expressRouter = express.Router();
var router = require('./routes/routes.js');

var app = express();

var mongoose = require('mongoose');
var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/songlink';
mongoose.connect(mongoUrl);

var port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
  var compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static('./dist'));
app.use(bodyParser.json());

app.use('/', expressRouter);
router(expressRouter);

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.log("Express server listening on port", port);
  }
});

module.exports = app;
