require('dotenv').load();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var db = require('./config/db.config');
var express = require('express');
var routes = require('./routes');

db();

var app = express();

app.use(express.static('./dist'));


app.use(bodyParser.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  require('./config/server.development.config')(app);
}

routes(app);

var port = process.env.PORT || 3000;

app.listen(port, function(error) {
  if (error) throw error
  console.log("Express server listening on port", port);
});

module.exports = app;
