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
  return (Math.abs(vidDuration - songDuration) / songDuration) < 0.05;
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
          verify(song, vids, callback);
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

function makeLinkFromId(youtubeId) {
  return 'https://www.youtube.com/watch?v=' + youtubeId;
}

function search(queryString, callback) {
  youtube.search(queryString, 10, function(err, res) {
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
  for (var i = 0; i < vids.length; i++) {
    var vidDuration = convertYoutubeDuration(vids[i].contentDetails.duration);
    if (compareDurations(vidDuration, song.track_length)) {
      song.youtube_id = vids[i].id;
      return callback(null, song);
    }
  }

  callback(new Error('No youtube vids verified'), null);
}
