if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var config = require('../webpack.config');
var express = require('express');
var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var expressRouter = express.Router();
var router = require('./router.js'); 

var plainText = require('./requests/plainTextSearch.js');

var app = express();
var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use(express.static('./dist'));

app.get('/search', plainText.appleSearch);

app.get('/preferences', function(req, res) {
  res.sendFile(path.resolve('client/index.html'));
});

app.get('/', function(req, res) {
  res.sendFile(path.resolve('client/index.html'));
});


app.use('/', expressRouter); 
router(expressRouter); 

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.log("Express server listening on port", port);
  }
});
