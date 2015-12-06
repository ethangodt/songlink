var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  hash_id: String,
  album_name: String,
  album_art: String,
  album_art_size: Number,
  youtube_id: String,
  spotify_id: String,
  itunes_id: String,
  clicks: Number,
  creates: Number
});

var Song = mongoose.model('song', songSchema);

module.exports = Song;
