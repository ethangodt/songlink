var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
	hash_id: String,
	title: String,
	artist: String,
	album_title: String,
	track_length: Number,
	source: String,
	source_id: String,
	lookup: Object,
	results_pruned: Object
});

var Song = mongoose.model('song', songSchema);

module.exports = Song;
