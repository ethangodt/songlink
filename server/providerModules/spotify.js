// accept id
// handle case when link is bad for single track
var spotify = require('spotify');
var verify = require('./spotifyVerification.js');

module.exports = function (searchInfo, callback) {

  var searchSpotifyByUrl = function(spotifyId) {
    spotify.lookup({ type: 'track', id: spotifyId}, function(err, data) {
      if ( err ) {
        callback(error)
        return;
      }
      makePrettyObject(err, data);
    });
  };

  var searchSpotifyByObj = function (songObject) {
    var searchQuery = songObject.title + ' ' + songObject.artist;
    spotify.search({type: 'track', query: searchQuery}, function(err, data) {
      if ( err ) {
        callback(error)
        return;
      }
      verify(songObject, data, makePrettyObject, err);
      // makePrettyObject(err, pick);
    });
  };

  var makePrettyObject = function(err, obj) {
    var formattedSongInfo = {
      title: obj.name,
      artist: obj.artists[0].name,
      album_title: obj.album.name,
      album_art: obj.album.images[0].url,
      album_art_size: 409600,
      spotify_id: obj.id,
      track_length: obj.duration_ms
    };
    callback(err, formattedSongInfo);
  };

  typeof searchInfo === "string" ? searchSpotifyByUrl(searchInfo) : searchSpotifyByObj(searchInfo);
};
