var playmusic = require('playmusic');
var pm = new playmusic();
var queries = require('../queries');

module.exports = {
  buildSearchResults: buildSearchResults,
  getTopGoogleResult: getTopGoogleResult,
  makeLink: makeLink,
	makeTemplateObject: makeTemplateObject,
  pruneSearchResults: pruneSearchResults
};

function buildSearchResults(song, callback) {

  if (song.source === 'google') {
    return callback(null, song)
  }

  song.results.google = {};

  for (var queryType in queries) {
    var query = queries[queryType].makeQuery(song);

    fetchSearchResults(song, query, queryType, function(err, songFromFetch) {
      if (err) {
        console.log(err);
      } else {
        if (Object.keys(songFromFetch.results.google).length === Object.keys(queries).length) {
          callback(null, songFromFetch);
        }
      }
    });
  }
}

function fetchSearchResults(song, query, queryType, callback) {

  pm.init({
    email: process.env.GOOGLE_MUSIC_EMAIL,
    password: process.env.GOOGLE_MUSIC_PASSWORD
  }, function(err, res) {
      if (err) {
        console.error(err);
        song.results.google[queryType] = {};
        song.results.google[queryType].query = query;
        song.results.google[queryType].results = [];
        callback(null, song);
      } else {
        pm.search(query, 20, function(err, data) {

          song.results.google[queryType] = {};
          song.results.google[queryType].query = query;

          if (err) {
            console.error(err);
            song.results.google[queryType].results = [];
          }

          if (err || !data.entries) {
            song.results.google[queryType].results = [];
          } else {
            var songs = [];

            var results = data.entries.sort(function(a, b) {
              return a.score < b.score;
            });

            for (var i = 0; i < results.length; i++) {
              if (results[i].track) {
                songs.push(results[i].track)
              }
            }

            song.results.google[queryType].results = songs.slice(0, 5);
          }

          callback(null, song);

        });
      }

  });
}

function getTopGoogleResult(song) {
  if (song.source === 'google') {
    return song.lookup;
  }

  if (song.results_pruned && song.results_pruned.hasOwnProperty('google')) {
    return song.results_pruned.google;
  }

  if (!song.results.google) {
    return null;
  }

  for (var queryType in queries) {
    var results = song.results.google[queryType].results;
    for (var i = 0; i < results.length; i++) {
      if (Math.abs(((results[i].durationMillis) - song.track_length) / song.track_length) < .02) {
        return results[i]
      }
    };
  }


  return null;

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

function makeLink(song) {
	var googleSong = getTopGoogleResult(song);

	if (!googleSong) {
		return undefined;
	}

  return 'https://play.google.com/music/m/' + googleSong.nid + '?signup_if_needed=1';
}

function makeTemplateObject(song) {
	var googleSong = getTopGoogleResult(song);

	return {
		provider: 'google',
    name: 'Google Play Music',
    icon: 'google',
    url: googleSong && makeLink(song),
    text: googleSong ? 'Play on Google Music' : 'Not available on Google Music',
    className: googleSong ? 'fullWidth google' : 'fullWidth disabled google'
	}
}

function pruneSearchResults(song, callback) {
  if (song.source === 'google') {
    song.results_pruned.google = song.lookup;
    return callback(null, song);
  }

  song.results_pruned.google = getTopGoogleResult(song);
  callback(null, song);
}
