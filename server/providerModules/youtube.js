var _ = require('underscore');
var ytnode = require('youtube-node');

var youtube = new ytnode();
require('dotenv').load();
var key = process.env.YOUTUBE_KEY;
youtube.setKey(key);

module.exports = function (searchInfo, callback) {

  var handleEchonestSong = function(err, song) {
    if (err) {
      handleError(err, song);
    } else {
      searchYoutube(song, handleYoutubeResults);
    }
  };

  var handleYoutubeResults = function(err, song) {
    if (err) {
      handleError(err, song);
    } else {
      checkDurations(song, handleCheckDurations);
    }
  };

  var handleCheckDurations = function(err, song) {
    if (err) {
      handleError(err, song);
    } else {
      callback(null, song);
    }
  };

  var handleError = function(err, song) {
    console.log(err);
    callback(err, song);
  };

  searchYoutube(searchInfo, handleYoutubeResults);

};

function searchYoutube(song, callback) {
  var query = song.title + " " + song.artist;

  youtube.search(query, 10, function(err, res) {
    if (err) {
      callback(err, null);
    } else {
      if (res.items.length > 0) {
        var ids = _.map(res.items, function(item) {
          if (item.id.kind === 'youtube#video') {
            return item.id.videoId;
          } 
        });
        _.extend(song, {youtube_id: ids})
        callback(null, song);
      } else {
        callback('Did not find kind=video', null);
      }
    }
  });
}

function checkDurations(song, callback) {
  console.log(song)
  youtube.getById(song.youtube_id.toString(), function (err, res) {
    if (err) {
      callback(err, null);
    } else {
      if (res.items.length) {
        var found = false;
        for (var i = 0; i < res.items.length; i++) {
          var vidDuration = convertYoutubeDuration(res.items[i].contentDetails.duration);
          if (compareDurations(vidDuration, song.track_length)) {
            song.youtube_id = song.youtube_id[i];
            found = true;
            callback(null, song);
            break;
          }
        }
        if (!found) {
          callback('Did not find match duration', null);
        }
      } else {
        callback('Did not find vid with id', null);
      }
    }
  });
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

function compareDurations(vidDuration, songDuration) {
  console.log(vidDuration, songDuration);
  return (Math.abs(vidDuration - songDuration) / songDuration) < 0.05;
}










// var youtube = require('youtube-node-with-params');

// youtube.setKey('AIzaSyB1XCSK0lbdnvCo-tKOfFxjV3LuGk7QOUE');

// var params = {
//     maxResults: 10,
//     kind: "youtube#video",
//     id: {
//       kind: "youtube#video"
//     }
//   };

// exports.search = function() {
//   var ids = [];
//   youtube.searchWithParams('deadmau5 the veldt', params, function(resultData) {
//       var results = resultData;
//       for (var i = 0; i < resultData.items.length; i++){
//         ids.push(resultData.items[i].id.videoId)
//       };
//       console.log(ids);
//   });
//   var par = {
//     id: ids
//   }
//   youtube.getById(par, function(r){
//     console.log(r)
//   })
// }



// var search = require('youtube-search');
 
// var opts = {
//   maxResults: 10,
//   key: 'AIzaSyB1XCSK0lbdnvCo-tKOfFxjV3LuGk7QOUE'
// };

// exports.search = function(){
//   search('deadmau5', {"part": "contentDetails"}, function(err, res) {
//     if(err) return console.log(err);
//     var results = res;
//     console.log(results);
//   })
// };

