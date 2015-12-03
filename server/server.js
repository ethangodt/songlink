if (process.env.NODE_ENV === 'development') {
  require('dotenv').load();
}

var config = require('../webpack.config');
var express = require('express');
var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var echobest = require('echo-best');

var key = process.env.ECHONEST_KEY;
var echo = echobest(key);

var app = express();
var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use(express.static('./dist'));

app.get('/search', function (req, res) {
  var opts = {
    combined: req.query.search,
    results: 10
  };
  
  echo('song/search', opts, function(error, response) {
    if (error) {
      console.error(error);
    } else {
      console.log(response.songs);
      res.send(response.songs);
    }
  });
});

app.get('/', function(req, res) {
  res.sendFile(path.resolve('client/index.html'));
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.log("Express server listening on port", port);
  }
});
