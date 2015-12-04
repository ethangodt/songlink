var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  hash_id: String,
  album_art: String,
  youtube_id: String,
  spotify_id: String,
  itunes_id: String,
  clicks: Number,
  creates: Number
});

var Song = mongoose.model('song', songSchema);

module.exports = Song;
