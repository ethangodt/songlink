var _ = require('underscore');
var ytnode = require('youtube-node');

var youtube = new ytnode();
var key = process.env.YOUTUBE_KEY;
youtube.setKey(key);

module.exports = {
  fetchSearchResults: fetchSearchResults,
  getTopYoutubeResult: getTopYoutubeResult,
  makeLinkFromId: makeLinkFromId
}

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
      callback(err, null);
    } else {
      getVideosByIds(ids.toString(), function (err, vids) {
        if (err) {
          callback(err, null);
        } else {
          var results = vids.length ? vids.slice(0, 5) : [];

          song.results.youtube[queryType] = {};
          song.results.youtube[queryType].query = query;
          song.results.youtube[queryType].results = results;

          callback(null, song);
        }
      });
    }
  });
};

function getTopYoutubeResult(song) {
  if (song.source === 'youtube') {
    return song.lookup;
  } else {
    var queryTypes = ['full', 'full-punc-keywords', 'full-albumParensBrackets', 'full-allParensBrackets', 'partial', 'partial-punc-keywords', 'partial-allParensBrackets'];
    for (var i = 0; i < queryTypes.length; i++) {
      var results = song.results.youtube[queryTypes[i]].results;
      for (var j = 0; j < results.length; j++) {
        if (Math.abs((convertYoutubeDuration(results[j].contentDetails.duration) - song.track_length) / song.track_length) < .05) {
          return results[j]
        }
      }
    }
  }
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
