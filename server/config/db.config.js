module.exports = function () {
	var mongoose = require('mongoose');

	var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/songlink';

	mongoose.connect(mongoUrl);
}
