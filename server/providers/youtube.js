var _ = require('underscore');
var ytnode = require('youtube-node');
var queries = require('../queries');

var youtube = new ytnode();
var key = process.env.YOUTUBE_KEY;
youtube.setKey(key);

module.exports = {
  buildSearchResults: buildSearchResults,
  getTopYoutubeResult: getTopYoutubeResult,
  makeLinkFromId: makeLinkFromId
};

function buildSearchResults(song, callback) {

  if (song.source === 'youtube') {
    return callback(null, song)
  }

  song.results.youtube = {};

  for (var queryType in queries) {
    var query = queries[queryType].makeQuery(song);

    fetchSearchResults(song, query, queryType, function(err, songFromFetch) {
      if (err) {
        console.log(err);
      } else {
        if (Object.keys(songFromFetch.results.youtube).length === Object.keys(queries).length) {
          callback(null, songFromFetch);
        }
      }
    });
  }
}

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
          song.results.youtube[queryType].results = vids.length ? vids : [];
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
    containsRecords: function (channelTitle) {
      return (channelTitle.search(/Records/) !== -1);
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
      heuristics.containsRecords,
      heuristics.containsTV,
      heuristics.isExactArtistName
    ];

    for (var i = 0; i < queryTypes.length; i++) {
      var topResult = song.results.youtube[queryTypes[i]].results[0];

      // this checks for queryType that might return nothing
      if (!topResult) {
        continue;
      }

      // runs the sequence of checks specifically for topResults, and also checks that the vid is not a full album with isNotTwiceAsLong
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
    // 1. EXTRAORDINARY EXCEPTION: checks for 'The Beatles' as the channelTitle because they're huge
    for (var i = 0; i < queryTypes.length; i++) {
      var allResults = song.results.youtube[queryTypes[i]].results;

      // this checks for queryType that might return nothing
      if (!allResults.length) {
        continue;
      }

      for (var j = 0; j < allResults.length; j++) {
        var currentChannel = allResults[j].snippet.channelTitle;
        if (currentChannel === 'The Beatles') {
          return allResults[j];
        }
      }
    }

    // 2. check for vids with hashtag in channel and approxDuration
    for (i = 0; i < queryTypes.length; i++) {
      allResults = song.results.youtube[queryTypes[i]].results;

      // this checks for queryType that might return nothing
      if (!allResults.length) {
        continue;
      }

      for (j = 0; j < allResults.length; j++) {
        currentChannel = allResults[j].snippet.channelTitle;
        currentDuration = convertYoutubeDuration(allResults[j].contentDetails.duration);
        if (heuristics.containsHashtag(currentChannel) && heuristics.isApproxDuration(currentDuration, song.track_length)) {
          return allResults[j];
        }
      }
    }

    // 3. check for vids with just approxDuration
    for (i = 0; i < queryTypes.length; i++) {
      allResults = song.results.youtube[queryTypes[i]].results;

      // this checks for queryType that might return nothing
      if (!allResults.length) {
        continue;
      }

      for (j = 0; j < allResults.length; j++) {
        currentDuration = convertYoutubeDuration(allResults[j].contentDetails.duration);
        if (heuristics.isApproxDuration(currentDuration, song.track_length)) {
          return allResults[j];
        }
      }
    }

    // if everything fails
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
  youtube.search(queryString, 20, function(err, res) {
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
