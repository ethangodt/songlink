require('dotenv').load();

var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var db = require('./config/db.config');
var express = require('express');
var routes = require('./routes');
var cors = require('cors');

db();

var app = express();

app.use(cors());

app.use(compress());
app.use(express.static('./dist'));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

if (process.env.NODE_ENV === 'development') {
  require('./config/server.development.config')(app);
}

routes(app);

var port = process.env.PORT || 3000;

app.listen(port, function(error) {
  if (error) throw error;
  console.log("Express server listening on port", port);
});

module.exports = app;
