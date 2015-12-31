var _ = require('underscore');
var ytnode = require('youtube-node');

var youtube = new ytnode();
var key = process.env.YOUTUBE_KEY;
youtube.setKey(key);

module.exports = {
  fetchSearchResults: fetchSearchResults,
  getTopYoutubeResult: getTopYoutubeResult,
  makeLinkFromId: makeLinkFromId
};

// returns time in milliseconds
function convertYoutubeDuration(str) {
  var fromHours, fromMinutes, fromSeconds;

  if (str.match(/(\d+)H/)) {
    fromHours = Number(str.match(/(\d+)H/)[1]) * 60 * 60 ;
  } else {
    fromHours = 0;
  }

  if (str.match(/(\d+)M/)) {
    fromMinutes = Number(str.match(/(\d+)M/)[1]) * 60;
  } else {
    fromMinutes = 0;
  }

  if (str.match(/(\d+)S/)) {
    fromSeconds = Number(str.match(/(\d+)S/)[1]);
  } else {
    fromSeconds = 0;
  }

  var total = fromHours + fromMinutes + fromSeconds;
  return total * 1000;
}

function fetchSearchResults(song, query, queryType, callback) {

  search(query, function(err, ids) {

    if (err) {
      console.error(err);
      song.results.youtube[queryType] = {};
      song.results.youtube[queryType].query = query;
      song.results.youtube[queryType].results = [];
      callback(null, song);
    } else {
      getVideosByIds(ids.toString(), function (err, vids) {

        song.results.youtube[queryType] = {};
        song.results.youtube[queryType].query = query;

        if (err) {
          console.error(err);
          song.results.youtube[queryType].results = [];
        } else {
          song.results.youtube[queryType].results = vids.length ? vids.slice(0, 5) : [];
        }

        callback(null, song);

      });
    }

  });
}

function getTopYoutubeResult(song) {
  if (song.source === 'youtube') {
    return song.lookup;
  }

  if (!song.results.youtube) {
    return undefined;
  }

  var queryTypes = ['full-punc-keywords', 'full-albumParensBrackets', 'full-allParensBrackets', 'partial', 'partial-punc-keywords', 'partial-allParensBrackets'];

  var heuristics = {
    containsVevo: function (channelTitle) {
      return (channelTitle.search(/VEVO$/) !== -1);
    },
    isExactRecordLabel: function (channelTitle) {
      var recordLabels = [
        'RCA Records',
        'Capitol Records',
        'CapitolMusic',
        'Interscope Records',
        'Warner Music Group',
        'Fueled By Ramen',
        'emimusic',
        'Columbia Records UK',
        'Columbia Records',
        'Def Jam Recordings',
        'Atlantic Records',
        'SONY Music Entertainment'
      ];
      return recordLabels.some(function (label) {
        var re = new RegExp('^' + label + '$');
        return (channelTitle.search(re) !== -1);
      });
    },
    containsTV: function (channelTitle) {
      return (channelTitle.search(/TV$/) !== -1);
    },
    isExactArtistName: function (channelTitle, artist) {
      return channelTitle === artist;
    },
    containsHashtag: function (channelTitle) {
      return (channelTitle.search(/^#/) !== -1)
    },
    isApproxDuration: function (apiResultDuration, localSongDuration) {
      return Math.abs((apiResultDuration - localSongDuration) / localSongDuration) < .05;
    },
    isNotTwiceAsLong: function (apiResultDuration, localSongDuration) {
      return (apiResultDuration / localSongDuration) < 2;
    }
  };

  var testTopResults = function () {
    var sequence = [
      heuristics.containsVevo,
      heuristics.isExactRecordLabel,
      heuristics.containsTV,
      heuristics.isExactArtistName
    ];

    for (var i = 0; i < queryTypes.length; i++) {
      var topResult = song.results.youtube[queryTypes[i]].results[0];

      // runs the sequence of checks specifically for topResults, and also checks that the vid is not album with isNotTwiceAsLong
      var someCheck = function (test) {
        var currentDuration = convertYoutubeDuration(topResult.contentDetails.duration);
        return test(topResult.snippet.channelTitle) && heuristics.isNotTwiceAsLong(currentDuration, song.track_length);
      };

      if (sequence.some(someCheck)) {
        return topResult;
      }
    }

    return undefined;
  };

  var testAllResults = function () {
    // check for vids with hashtag in channel and approxDuration
    for (var i = 0; i < queryTypes.length; i++) {
      var allResults = song.results.youtube[queryTypes[i]].results;
      for (var j = 0; j < allResults.length; j++) {
        var currentChannel = allResults[j].snippet.channelTitle;
        var currentDuration = convertYoutubeDuration(allResults[j].contentDetails.duration);
        if (heuristics.containsHashtag(currentChannel) && heuristics.isApproxDuration(currentDuration, song.track_length)) {
          return allResults[j];
        }
      }
    }

    // check for vids with just approxDuration
    for (var k = 0; k < queryTypes.length; k++) {
      allResults = song.results.youtube[queryTypes[k]].results;
      for (var l = 0; l < allResults.length; l++) {
        currentDuration = convertYoutubeDuration(allResults[l].contentDetails.duration);
        if (heuristics.isApproxDuration(currentDuration, song.track_length)) {
          return allResults[l];
        }
      }
    }

    return undefined;
  };

  return testTopResults() || testAllResults() || undefined;
}

function getVideosByIds(ids, callback) {
  // ids should be comma separated string of ids
  youtube.getById(ids, function (err, res) {
    if (err || !res.items.length) {
      callback(new Error('Error fetching yt vids by ids:', err), null);
    } else {
      callback(null, res.items);
    }
  });
}

function makeLinkFromId(youtubeId) {
  return 'https://www.youtube.com/watch?v=' + youtubeId;
}

function search(queryString, callback) {
  youtube.search(queryString, 10, function(err, res) {
    if (err) {
      console.error(err);
      callback(new Error('Could not find any yt search results due to error'), null);
    } else if (!res.items.length) {
      callback(null, []);
    } else {
      var ids = _.map(res.items, function(item) {
        if (item.id.kind === 'youtube#video') {
          return item.id.videoId;
        }
      });
      callback(null, ids);
    }
  });
}

// function verify(song, vids, callback) {
//   song.youtube_id = vids[0].id;
//   callback(null, song);
//   var results = [];
//   var vevo = song.artist.split(' ').join('').toLowerCase() + 'vevo';
//   for (var i = 0; i < vids.length; i++) {
//     var vidDuration = convertYoutubeDuration(vids[i].contentDetails.duration);
//     if (vids[i].snippet.channelTitle.toLowerCase() === vevo && vids[i].snippet.title.toLowerCase().includes(song.title)) {
//       if ((Math.abs(vidDuration - song.track_length) / song.track_length) < 0.15) {
//         results.push(vids[i]);
//       }
//     }
//     if (vids[i].snippet.channelTitle.toLowerCase() === song.artist.toLowerCase()) {
//       results.push(vids[i])
//     }
//     if (compareDurations(vidDuration, song.track_length)) {
//       results.push(vids[i]);
//     }
//   }
//   var bestMatch = verify2(results);
//   bestMatch ? song.youtube_id = bestMatch.id : song.youtube_id = vids[0].id;
//   return callback(null, song);
// }

// function verify2(results) {
//   var best = 0;
//   var index;
//   for (var i=0; i<results.length; i++) {
//     if (results[i].statistics.likeCount > 100) {
//       var stats = results[i].statistics;
//       var rating = (stats.likeCount / stats.dislikeCount) * stats.viewCount;
//       if (rating > best) {
//         best = rating;
//         index = i
//       }
//     }
//   }
//   return (results[index])
// }
