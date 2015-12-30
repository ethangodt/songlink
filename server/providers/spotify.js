var spotify = require('spotify');

module.exports = {
  fetchSearchResults: fetchSearchResults,
  getAlbumArtUrl: getAlbumArtUrl,
  getTopSpotifyResult: getTopSpotifyResult,
  lookupSongById: lookupSongById,
  makeUriFromId: makeUriFromId
};

function fetchSearchResults(song, query, queryType, callback) {

  spotify.search({type: 'track', query: query}, function(err, data) {
    
    song.results.spotify[queryType] = {};
    song.results.spotify[queryType].query = query;

    if (err) {
      console.error(err);
      song.results.spotify[queryType].results = [];
    } else {
      var results = data.tracks && data.tracks.items.length ? data.tracks.items.slice(0, 5) : [];
      song.results.spotify[queryType].results = results;
    }

    callback(null, song);

  });
};

function getAlbumArtUrl(song, size) {
  var sizes = ['large', 'medium', 'small'];
  if (!song.lookup && !song.result) {
    return song.album_art;
  } else if (song.source === 'spotify') {
    return song.lookup.album.images[sizes.indexOf(size)].url;
  } else {
    var topSpotifyResult = getTopSpotifyResult(song);
    if (topSpotifyResult) {
      return topSpotifyResult.album.images[sizes.indexOf(size)].url;
    } else {
      return undefined;
    }
  }
}

function getTopSpotifyResult(song) {
  if (song.source === 'spotify') {
    return song.lookup;
  } 

  if (!song.results.spotify) {
    return undefined;
  }

  var queryTypes = ['full', 'full-punc-keywords', 'full-albumParensBrackets', 'full-allParensBrackets', 'partial', 'partial-punc-keywords', 'partial-allParensBrackets'];

  for (var i = 0; i < queryTypes.length; i++) {
    var results = song.results.spotify[queryTypes[i]].results;
    for (var j = 0; j < results.length; j++) {
      if (Math.abs((results[j].duration_ms - song.track_length) / song.track_length) < .02) {
        return results[j]
      }
    }
  }

  return undefined;

}

function lookupSongById(song, callback) {
  if (song.lookup) {
    return callback(null, song);
  }

  spotify.lookup({ type: 'track', id: song.source_id}, function(err, data) {
    if ( data.error || err ) {
      callback(new Error('Could not verify ID'), null);
    } else {
      song.lookup = data;
      song.title = data.name;
      song.artist = data.artists[0].name;
      song.album_title = data.album.name;
      song.track_length = data.duration_ms;
      callback(null, song);
    }
  });
};

function makeUriFromId(spotifyId) {
  return 'spotify:track:' + spotifyId;
};
