var spotify = require('spotify');
var request = require('request');
var queries = require('../queries');

module.exports = {
  buildSearchResults: buildSearchResults,
  getAlbumArtUrl: getAlbumArtUrl,
  getTopSpotifyResult: getTopSpotifyResult,
  lookupSongById: lookupSongById,
  makeUriFromId: makeUriFromId
};

function buildSearchResults(song, callback) {

  if (song.source === 'spotify') {
    return callback(null, song)
  }

  song.results.spotify = {};
 
  for (var queryType in queries) {
    var query = queries[queryType].makeQuery(song);

    fetchSearchResults(song, query, queryType, function(err, songFromFetch) {
      if (err) {
        console.log(err);
      } else {
        if (Object.keys(songFromFetch.results.spotify).length === Object.keys(queries).length) {
          callback(null, songFromFetch);
        }
      }
    });
  }
}

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
}

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

  for (var queryType in queries) {
    var results = song.results.spotify[queryType].results;
    for (var i = 0; i < results.length; i++) {
      if (Math.abs(((results[i].duration_ms) - song.track_length) / song.track_length) < .02) {
        return results[i]
      }
    };
  }

  return undefined;

}

function lookupSongById(song, callback) {
  if (song.lookup && song.source === 'spotify') {
    return callback(null, song);
  }

  request(makeLookupUrlWIthId(song.source_id), function (err, response, body) {
    try {
      body = JSON.parse(body);
    } catch (e) {
      callback(new Error('Could not verify ID'), null);
    }

    if (err) {
      callback(new Error('Could not verify ID'), null);
    } else {
      song.lookup = body;
      song.title = body.name;
      song.artist = body.artists[0].name;
      song.album_title = body.album.name;
      song.track_length = body.duration_ms;
      callback(null, song);
    }
  });

  // spotify.lookup({ type: 'track', id: song.source_id}, function(err, data) {
  //   if ( data.error || err ) {
  //     callback(new Error('Could not verify ID'), null);
  //   } else {
  //     song.lookup = data;
  //     song.title = data.name;
  //     song.artist = data.artists[0].name;
  //     song.album_title = data.album.name;
  //     song.track_length = data.duration_ms;
  //     callback(null, song);
  //   }
  // });
}

function makeLookupUrlWIthId(id) {
  return 'https://api.spotify.com/v1/tracks/' + id;
}

function makeUriFromId(spotifyId) {
  return 'spotify:track:' + spotifyId;
}
