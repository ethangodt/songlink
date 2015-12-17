var _ = require('underscore');
var ytnode = require('youtube-node');

var youtube = new ytnode();
var key = process.env.YOUTUBE_KEY;
youtube.setKey(key);

module.exports = {
  fetchSongBySearch: fetchSongBySearch,
  makeLinkFromId: makeLinkFromId
}

function compareDurations(vidDuration, songDuration) {
  return (Math.abs(vidDuration - songDuration) / songDuration) < 0.08;
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

function fetchSongBySearch(song, callback) {
  var queryString = song.title + ' ' + song.artist;
  search(queryString, function(err, ids) {
    if (err) {
      callback(err, null);
    } else {
      getVideosByIds(ids.toString(), function (err, vids) {
        if (err) {
          callback(err, null);
        } else {
          vids.length ? verify(song, vids, callback) : passOnWithUndefined(song, callback);
        }
      });
    }
  });
};

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

function passOnWithUndefined(song, callback) {
  song.youtube_id = undefined;
  console.log('No results from youtube (youtube.js)');
  callback(null, song);
}

function makeLinkFromId(youtubeId) {
  return 'https://www.youtube.com/watch?v=' + youtubeId;
}

function search(queryString, callback) {
  console.log(queryString);
  youtube.search(queryString, 1, function(err, res) {
    if (err || !res.items.length) {
      callback(new Error('Could not find any yt search results:', err), null);
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

function verify(song, vids, callback) {
  song.youtube_id = vids[0].id;
  callback(null, song);
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
}

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
