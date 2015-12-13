var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  hash_id: String,
  album_title: String,
  album_art: String,
  album_art_size: Number,
  youtube_id: String,
  spotify_id: String,
  itunes_id: String,
  itunes_app_uri: String,
  clicks: Number,
  creates: Number,
  track_length: Number,
  spotify_images: Object
});

var Song = mongoose.model('song', songSchema);

module.exports = Song;
