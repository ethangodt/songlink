require('dotenv').load();

var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var db = require('./config/db.config');
var express = require('express');
var routes = require('./routes');

// var enableCORS = function(req, res, next) {
// 		res.header('Access-Control-Allow-Origin', '*');
// 		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
// 		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//
// 		// intercept OPTIONS method
// 		if ('OPTIONS' == req.method) {
// 			res.send(200);
// 		}
// 		else {
// 			next();
// 		}
// };

db();

var app = express();

// app.use(enableCORS);

app.use(compress());
app.use(express.static('./dist'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

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
