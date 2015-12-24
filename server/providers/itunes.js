var request = require('request');

module.exports = {
  fetchSearchResults: fetchSearchResults,
  getAlbumArtUrl: getAlbumArtUrl,
  getTopItunesResult: getTopItunesResult,
  lookupSongById: lookupSongById,
  makeLink: makeLink,
  makeSearchResultsObjects: makeSearchResultsObjects,
  makeSearchUrlWithQuery: makeSearchUrlWithQuery,
  makeText: makeText,
  search: search
};


function fetchSearchResults(song, query, queryType, callback) {
  search(makeSearchUrlWithQuery(query), 10, function (err, songs) {
    if (err) {
      callback(err, null)
    } else {
      var results = songs.length ? songs : [];

      song.results.itunes.queryTypes.push(queryType);
      song.results.itunes[queryType] = {};
      song.results.itunes[queryType].query = query;
      song.results.itunes[queryType].results = results;

      callback(null, song);
    }
  });
}

function getAlbumArtUrl(song) {
  if (song.source === 'itunes') {
    return song.lookup.artworkUrl100;
  } else {
    var topItunesResult = getTopItunesResult(song);
    if (topItunesResult) {
      return topItunesResult.artworkUrl100;
    } else {
      return undefined;
    }
  }
}

function getTopItunesResult(song) {
  if (song.source === 'itunes') {
    return song.lookup;
  } else {
    return song.results.itunes.full.results.length ? song.results.itunes.full.results[0] : song.results.itunes.partial.results[0];
  }
}

function lookupSongById(song, callback) {
  if (!song.lookup) {
    return callback(null, song);
  }

  search(makeFetchByIdUrl(song.source_id), 1, function(err, results) {
    if (err || !results.length) {
      callback(new Error('Link is not valid'), null);
    } else {
      song.lookup = results[0];
      callback(null, song);
    }
  });
}

function makeAppUri(trackViewUrl) {
  var arrAppUri = trackViewUrl.split('');
  arrAppUri.splice(8, 0, 'geo.');
  arrAppUri.splice(-4, 4, 'mt=1&app=music');
  return arrAppUri.join('');
}

function makeFetchByIdUrl(itunesId) {
  return 'https://itunes.apple.com/lookup?id=' + itunesId;
}

function makeSearchResultsObjects(results) {
  songs = [];

  results.forEach(function(song) {
    songs.push({
      title: song.trackName,
      artist: song.artistName,
      album_title: song.collectionName,
      album_art: song.artworkUrl100,
      source_id: song.trackId,
      source: 'itunes',
      lookup: song
    });
  });

  return songs;
}

function makeSearchUrlWithQuery(query) {
  return 'https://itunes.apple.com/search?term=' + query + '&entity=song';
}

function makeLink(itunesSong) {
  if (itunesSong.isStreamable) {
    return makeAppUri(itunesSong.trackViewUrl);
  } else {
    return itunesSong.trackViewUrl;
  }
}

function makeText(itunesSong) {
  if (itunesSong.isStreamable) {
    return 'Play now in Apple Music';
  } else {
    return 'Open now in iTunes Store';
  }
}

function search(searchUrl, numResults, callback) {
  request(searchUrl, function (err, response, body) {
    body = JSON.parse(body);
    if (err) {
      callback(err, null);
    } else {
      callback(null, body.results.length ? body.results.slice(0, numResults) : []);      
    }
  });
}
