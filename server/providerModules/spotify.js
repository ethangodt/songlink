// accept id
// handle case when link is bad for single track
var spotify = require('spotify');

module.exports = function (searchInfo, callback) {

  var lookupById = function(id) {
    spotify.lookup({ type: 'track', id: spotifyID}, function(err, data) {
        if ( err ) {
          callback(error)
          return;
        }
        makePrettyObject(err, data);      
    });
  };

  var searchSpotifyByObj = function (songObject) {
    var searchQuery = songObject.name + ' ' + songObject.artist + ' ' + songObject.album_name;
    spotify.search({ type: 'track', query: searchQuery}, function(err, data) {
        if ( err ) {
          callback(error)
          return;
        }
        makePrettyObject(err, data);      
    });
  };

  var searchSpotifyByUrl = function (songUrl) {
    lookupById(songUrl);
  };

  var makePrettyObject = function(err, obj) {
    var formattedSongInfo = {
      title: obj.tracks.items[0].name,
      artist: obj.tracks.items[0].artists[0].name,
      title: obj.tracks.items[0].album.name,
      album_art: obj.tracks.items[0].album.images[0].url,
      album_art_size: 10000,
      spotify_id: obj.tracks.items[0].id
    };
    callback(err, formattedSongInfo);
  };

  typeof searchInfo === "string" ? searchSpotifyByUrl(searchInfo) : searchSpotifyByObj(searchInfo)
};
