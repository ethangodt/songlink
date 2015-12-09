var spotify = require('spotify');

module.exports = {
  fetchSongById: fetchSongById,
  fetchSongBySearch: fetchSongBySearch,
  makeUriFromId: makeUriFromId
};

function fetchSongById(spotifyId, callback) {
  spotify.lookup({ type: 'track', id: spotifyId}, function(err, data) {
    if ( err ) {
      callback(err, null);
    } else {
      callback(null, makePrettyObject(data));
    }
  });
};

function fetchSongBySearch(song, callback) {
  var searchQuery = song.title + ' ' + song.artist;
  spotify.search({type: 'track', query: searchQuery}, function(err, data) {
    var tracks = data.tracks.items;
    if ( err ) {
      callback(err, null)
    } else {
      tracks.length ? verify(song, tracks, callback) : callback(new Error('No results from spt'), null);
    }
  });
};

function makeUriFromId(spotifyId) {
  return 'spotify:track:' + spotifyId;
}

function makePrettyObject(obj) {
  return {
    title: obj.name,
    artist: obj.artists[0].name,
    album_title: obj.album.name,
    album_art: obj.album.images[0].url,
    album_art_size: 409600,
    spotify_id: obj.id,
    track_length: obj.duration_ms
  };
};

function verify(song, spotifyTracks, callback) {

  for (var i = 0; i < spotifyTracks.length; i++) {
    var durationsMatch = (Math.abs(song.track_length - spotifyTracks[i].duration_ms) / spotifyTracks[i].duration_ms) < 0.03;
    var artistsMatch = song.artist.includes(spotifyTracks[i].artists[0].name);

    if (durationsMatch && artistsMatch) {
      song.spotify_id = spotifyTracks[i].id
      return callback(null, song);  
    }
  }

  callback(new Error('No spotify tracks verified'), null);
}
