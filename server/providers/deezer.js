var request = require('request');

module.exports = {
  fetchSearchResults: fetchSearchResults,
  getTopDeezerResult: getTopDeezerResult,
  getLink : getLink
};

function fetchSearchResults(song, query, queryType, callback) {

  search(makeSearchUrlWithQuery(query), 5, function (err, songs) {

    song.results.deezer[queryType] = {};
    song.results.deezer[queryType].query = query;

    if (err) {
      console.error(err);
      song.results.deezer[queryType].results = [];
    } else {
      song.results.deezer[queryType].results = songs.length ? songs : [];
    }

    callback(null, song);

  });
}

function getTopDeezerResult(song) {
  if (song.source === 'deezer') {
    return song.lookup;
  } 

  if (!song.results.deezer) {
    return undefined;
  }

  var queryTypes = ['full', 'full-punc-keywords', 'full-albumParensBrackets', 'full-allParensBrackets', 'partial', 'partial-punc-keywords', 'partial-allParensBrackets'];

  for (var i = 0; i < queryTypes.length; i++) {
    var results = song.results.deezer[queryTypes[i]].results;
    for (var j = 0; j < results.length; j++) {
      if (Math.abs(((results[j].duration * 1000) - song.track_length) / song.track_length) < .02) {
        return results[j]
      }
    }
  }

  return undefined;

}

// function lookupSongById(song, callback) {
//   if (song.lookup) {
//     return callback(null, song);
//   }

//   spotify.lookup({ type: 'track', id: song.source_id}, function(err, data) {
//     if ( data.error || err ) {
//       callback(new Error('Link is not valid'), null);
//     } else {
//       song.lookup = data;
//       song.title = data.name;
//       song.artist = data.artists[0].name;
//       song.album_title = data.album.name;
//       song.track_length = data.duration_ms;
//       callback(null, song);
//     }
//   });
// };

function getLink (song) {
  return song.link;
}

function makeSearchUrlWithQuery(query) {
  query = query.replace(/\s+/g, "+");
  return 'https://api.deezer.com/search?q=' + query;
}

function search(searchUrl, numResults, callback) {
  request(searchUrl, function (err, response, body) {
    
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
      body.data = [];
    }

    if (err) {
      body.data = [];
    } else {
      callback(null, body.data.length ? body.data.slice(0, numResults) : []);      
    }
  });
}
