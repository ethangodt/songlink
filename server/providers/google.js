var playmusic = require('playmusic');
var pm = new playmusic();

module.exports = {
  fetchSearchResults: fetchSearchResults,
  getTopGoogleResult: getTopGoogleResult,
  // lookupSongById: lookupSongById,
  makeUrlFromId: makeUrlFromId
};

function fetchSearchResults(song, query, queryType, callback) {
  pm.init({
    email: process.env.GOOGLE_MUSIC_EMAIL,
    password: process.env.GOOGLE_MUSIC_PASSWORD
  }, function(err, res) {
      if (err) {
        console.error(err);
        return [];
      }

      pm.search(query, 20, function(err, data) {

        song.results.google[queryType] = {};
        song.results.google[queryType].query = query;
        

        if (!data.entries) {
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
  });
};

function getTopGoogleResult(song) {
  if (song.source === 'google') {
    return song.lookup;
  } 

  if (!song.results.google) {
    return undefined;
  }

  var queryTypes = ['full', 'full-punc-keywords', 'full-albumParensBrackets', 'full-allParensBrackets', 'partial', 'partial-punc-keywords', 'partial-allParensBrackets'];

  for (var i = 0; i < queryTypes.length; i++) {
    var results = song.results.google[queryTypes[i]].results;
    for (var j = 0; j < results.length; j++) {
      if (Math.abs((results[j].durationMillis - song.track_length) / song.track_length) < .02) {
        return results[j]
      }
    }
  }
  
};

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

function makeUrlFromId(googleId) {
  return 'https://play.google.com/music/m/' + googleId + '?signup_if_needed=1';
};
