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
	results_pruned: Object,

	// TODO: delete these once all pruned
  // itunes_app_uri: String,
  // itunes_store_uri: String,
  // itunes_id: String,
  // spotify_id: String,
  // youtube_id: String,
	// results: Object,
	// searches: Array

});

var Song = mongoose.model('song', songSchema);

module.exports = Song;
