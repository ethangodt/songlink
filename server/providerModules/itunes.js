var request = require('request');

// todo possibly refactor this to accommodate Stobie's searching as well
// todo handle times when the iTunes search is down and requests fail

module.exports = function (searchInfo) {
  debugger;
  var baseSearch = 'https://itunes.apple.com/search?term=';
  var entity = '&entity=song';
  var songInfoString = '';

  // search info is an object that can include different amounts of information about a song
  for (var key in searchInfo) {
    if (searchInfo.hasOwnProperty(key)) {
      // song info string is a search string that iTunes search api recognizes
      if (key === 'name' || key === 'artist' || key === 'album_name') {
        songInfoString += searchInfo[key].split(' ').join('+');
        songInfoString += '+';
      }
    }
  }

  // this removes extraneous last plus
  songInfoString = songInfoString.substring(0, songInfoString.length - 2);

  var fullSearch = baseSearch + songInfoString + entity;

  request(fullSearch, function (error, response, body) {
    // build actual response from the body
    debugger;
  })
};
