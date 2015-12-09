var request = require('request');

// This is an example of a service modules that we'll be using to search services for information.
// Given the circumstances in which they're called, they will either be called
// with a id string for the service, or they will be called with an object
// containing some song information.

// When this function receives a string id it will query the service to get the exact match.
// When this function receives an object it iterates of the object and makes
// a request with the relevant information from the object (everything but the ids of other services).

// todo possibly refactor this to accommodate Stobie's client searching as well
// todo handle scenarios when the iTunes search is down and requests fail

module.exports = function (searchInfo, callback) {

  var makeUrlWithObject = function (songObject) {
    var baseSearch = 'https://itunes.apple.com/search?term=';
    var entity = '&entity=song';
    var songInfoString = '';

    for (var key in songObject) {
      if (songObject.hasOwnProperty(key)) { // check to make sure the keys are not on prototype
        // songInfoString is a search string that iTunes search api recognizes
        if (key === 'title' || key === 'artist' || key === 'album_title') {
          songInfoString += songObject[key].split(' ').join('+');
          songInfoString += '+';
        }
      }
    }

    // this removes extraneous '+'
    songInfoString = songInfoString.substring(0, songInfoString.length - 1);

    return baseSearch + songInfoString + entity;
  };

  var makeUrlWithString = function (idString) {
    return 'https://itunes.apple.com/lookup?id=' + idString;
  };

  var searchUrl = (typeof searchInfo === 'string') ? makeUrlWithString(searchInfo): makeUrlWithObject(searchInfo);

  request(searchUrl, function (err, response, body) {
    body = JSON.parse(body);

    if (err) {
      callback(err);
    } else if (body.resultCount > 1) {
      callback(new Error('Too many results'), null)
    } else {
      var song = body.results[0];

      var formattedSongInfo = {
        title: song.trackName,
        artist: song.artistName,
        album_title: song.collectionName,
        album_art: song.artworkUrl100,
        album_art_size: 10000,
        itunes_id: '' + song.trackId
      };

      callback(err, formattedSongInfo);
    }
  })
};
