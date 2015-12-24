// var utils = require('../utils/utils');
var spotify = require('spotify');

module.exports = {
  lookupSongById: lookupSongById,
  fetchSearchResults: fetchSearchResults,
  makeUriFromId: makeUriFromId
};

function lookupSongById(song, callback) {
  spotify.lookup({ type: 'track', id: song.source_id}, function(err, data) {
    if ( data.error || err ) {
      callback(new Error('Link is not valid'), null);
    } else {
      song.lookup = data;
      song.title = data.name;
      song.artist = data.artists[0].name;
      song.album_title = data.album.name;
      callback(null, song);
    }
  });
};

function fetchSearchResults(song, query, queryType, callback) {
  spotify.search({type: 'track', query: query}, function(err, data) {
    if ( err ) {
      callback(err, null)
    } else {
      var results = data.tracks.items.length ? data.tracks.items : [];

      song.results.spotify.queryTypes.push(queryType);
      song.results.spotify[queryType] = {};
      song.results.spotify[queryType].query = query;
      song.results.spotify[queryType].results = results;

      callback(null, song);
    }
  });
};

function makeUriFromId(spotifyId) {
  return 'spotify:track:' + spotifyId;
};

// function makePrettyObject(obj) {
//   return {
//     title: obj.name,
//     artist: obj.artists[0].name,
//     album_title: obj.album.name,
//     album_art: obj.album.images[0].url,
//     album_art_size: 409600,
//     spotify_id: obj.id,
//     track_length: obj.duration_ms,
//     spotify_images: {
//       large_image: obj.album.images[0],
//       medium_image: obj.album.images[1],
//       small_image: obj.album.images[2]
//     }
//   };
// };

// function verify(song, spotifyTracks, callback){
//   for (var i=0; i<spotifyTracks.length; i++) {
//     var spotifyArtist = utils.convertArtist(spotifyTracks[i].artists[0].name);
//     var otherArtist = utils.convertArtist(song.artist);
//     var artistsMatch = utils.verifyArtistMatch(spotifyArtist, otherArtist);
//     var durationsMatch = utils.verifyMsMatch(spotifyTracks[i].duration_ms, song.track_length);
//     // if (durationsMatch && artistsMatch) {
//     if (durationsMatch) {
//       song.spotify_id = spotifyTracks[i].id;
//       song.spotify_images = {};
//       song.spotify_images.large_image = spotifyTracks[i].album.images[0];
//       song.spotify_images.medium_image = spotifyTracks[i].album.images[1];
//       song.spotify_images.small_image = spotifyTracks[i].album.images[2];
//       return callback(null, song);
//     }
//   }
//   passOnWithUndefined(song, callback);
// };
