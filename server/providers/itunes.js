var request = require('request');
var queries = require('../queries');

module.exports = {
  buildSearchResults: buildSearchResults,
  getAlbumArtUrl: getAlbumArtUrl,
  getTopItunesResult: getTopItunesResult,
  lookupSongById: lookupSongById,
  makeLink: makeLink,
  makeSearchResultsObjects: makeSearchResultsObjects,
  makeSearchUrlWithQuery: makeSearchUrlWithQuery,
	makeTemplateObject: makeTemplateObject,
  makeText: makeText,
  pruneSearchResults: pruneSearchResults,
  search: search
};

function buildSearchResults(song, callback) {

  if (song.source === 'itunes') {
    return callback(null, song)
  }

  song.results.itunes = {};

  var queryTypes = Array.prototype.slice.call(Object.keys(queries), 0);

  var getNextSearchResults = function() {

    var queryType = queryTypes.pop();
    var query = queries[queryType].makeQuery(song);

    fetchSearchResults(song, query, queryType, function(err, songFromFetch) {
      if (err) {
        console.log(err);
      } else {
        if (Object.keys(songFromFetch.results.itunes).length === Object.keys(queries).length) {
          callback(null, songFromFetch);
        }
      }
    });

    if (queryTypes.length) {
      setTimeout(function() {
        getNextSearchResults()
      }, 400);
    }
  };

  getNextSearchResults();
}

function fetchSearchResults(song, query, queryType, callback) {

  search(makeSearchUrlWithQuery(query), 10, function (err, songs) {

    song.results.itunes[queryType] = {};
    song.results.itunes[queryType].query = query;

    if (err) {
      console.error(err);
      song.results.itunes[queryType].results = [];
    } else {
      song.results.itunes[queryType].results = songs.length ? songs : [];
    }

    callback(null, song);

  });
}

function getAlbumArtUrl(song) {
  if (song.itunes_id) {
    return song.album_art;
  }

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
  }

  if (song.results_pruned && song.results_pruned.hasOwnProperty('itunes')) {
    return song.results_pruned.itunes;
  }

  if (!song.results.itunes) {
    return null;
  }

  for (var queryType in queries) {
    var results = song.results.itunes[queryType].results;
    for (var i = 0; i < results.length; i++) {
      if (Math.abs(((results[i].trackTimeMillis) - song.track_length) / song.track_length) < .02) {
        return results[i]
      }
    };
  }

  return null;

}

function lookupSongById(song, callback) {
  if (song.lookup) {
    return callback(null, song);
  }

  search(makeFetchByIdUrl(song.source_id), 1, function(err, results) {
    if (err || !results.length) {
      callback(new Error('Could not verify ID'), null);
    } else {
      song.lookup = results[0];
      song.title = results[0].trackName;
      song.artist = results[0].artistName;
      song.album_title = results[0].collectionName;
      song.track_length = results[0].trackTimeMillis;

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

function makeLink(song) {
	var itunesSong = getTopItunesResult(song);

	if (!itunesSong) {
		return undefined;
	}

	if (itunesSong.isStreamable) {
		return makeAppUri(itunesSong.trackViewUrl);
	} else {
		return itunesSong.trackViewUrl;
	}
}

function makeSearchResultsObjects(results) {
  songs = [];

  results.forEach(function(song) {
    songs.push({
      title: song.trackName,
      artist: song.artistName,
      album_title: song.collectionName,
      album_art: song.artworkUrl100,
      track_length: song.trackTimeMillis,
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

function makeTemplateObject(song) {
	var itunesSong = getTopItunesResult(song);

	return {
		provider: 'itunes',
		name: 'Apple Music',
		icon: 'apple',
		url: itunesSong && makeLink(song),
		text: itunesSong ? makeText(itunesSong) : 'Not available on iTunes',
		className: itunesSong ? 'fullWidth iTunes' : 'fullWidth disabled iTunes'
	}
}

function makeText(itunesSong) {
  if (itunesSong.isStreamable) {
    return 'Play on Apple Music';
  } else {
    return 'Open in iTunes Store';
  }
}

function pruneSearchResults(song, callback) {
  if (song.source === 'itunes') {
    song.results_pruned.itunes = song.lookup;
    return callback(null, song);
  }

  song.results_pruned.itunes = getTopItunesResult(song);
  callback(null, song);
}

function search(searchUrl, numResults, callback) {
  request(searchUrl, function (err, response, body) {

    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
      body.results = [];
    }

    if (err) {
      body.results = [];
    } else {
      callback(null, body.results.length ? body.results.slice(0, numResults) : []);
    }
  });
}
