var request = require('request');

module.exports = {
  lookupSongById: lookupSongById,
  fetchSearchResults: fetchSearchResults,
  makeSearchResultsObjects: makeSearchResultsObjects,
  makeSearchUrlWithQuery: makeSearchUrlWithQuery,
  search: search
};

function lookupSongById(song, callback) {
  search(makeFetchByIdUrl(song.source_id), 1, function(err, results) {
    if (err || !results.length) {
      callback(new Error('Link is not valid'), null);
    } else {
      song.lookup = results[0];
      callback(null, song);
    }
  });
}

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

function makeAppUri(trackViewUrl) {
  var arrAppUri = trackViewUrl.split('');
  arrAppUri.splice(8, 0, 'geo.');
  arrAppUri.splice(-4, 4, 'mt=1&app=music');
  return arrAppUri.join('');
}

function makeSearchUrlWithQuery(query) {
  return 'https://itunes.apple.com/search?term=' + query + '&entity=song';
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
      source: 'itunes'
    });
  });

  return songs;
}

function search(searchUrl, numResults, callback) {
  request(searchUrl, function (err, response, body) {
    body = JSON.parse(body);
    if (body.results.length === 0) {
      callback(new Error("Search returned no results"), null)
    } else if (err) {
      callback(err, null);
    } else {
      callback(null, body.results.length ? body.results.slice(0, numResults) : []);      
    }
  });
}
