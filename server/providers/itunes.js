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

  if (!song.results.itunes) {
    return undefined;
  }
    
  var queryTypes = ['full-punc-keywords', 'full-albumParensBrackets', 'full-allParensBrackets', 'partial', 'partial-punc-keywords', 'partial-allParensBrackets'];
  
  for (var i = 0; i < queryTypes.length; i++) {
    var results = song.results.itunes[queryTypes[i]].results;
    for (var j = 0; j < results.length; j++) {
      if (Math.abs((results[j].trackTimeMillis - song.track_length) / song.track_length) < .02) {
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

function makeLink(itunesSong) {
  if (itunesSong.isStreamable) {
    return makeAppUri(itunesSong.trackViewUrl);
  } else {
    return itunesSong.trackViewUrl;
  }
}

function makeText(itunesSong) {
  if (itunesSong.isStreamable) {
    return 'Play on Apple Music';
  } else {
    return 'Open in iTunes Store';
  }
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
