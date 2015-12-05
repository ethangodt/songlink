// require identify url

/*

{
  Spotify: id,
  YouTube: id, mvp?
  iTunes: id or something
}

*/

// make call to string parse/identifier module

// call spotify module with the goods about song id to get song information like title
// if the request returns positive then check the db or build out the rest of the data
// if the request does not turn out ok then you should end response with an error
// should each module come built in with some sort of integrity detection? yes....


var spotify = require("");
var itunes = require("");

exports.checkService = function(url) {
  if (text.slice(0,4) === "http") {
    if (text.includes("itun.es")) {
      exports.itunesURL(text);
    } else if (text.includes("spotify")) {
      exports.spotifyURL(text);
    }
  } else if (text.slice(0,8) === "spotify:") {
    spotifyURI(text);
  }
};

exports.spotifyURL = function(url) {
  var arr = text.split('/');
  var spotifyID = arr[arr.length - 1];
  return spotifyID;
};

exports.spotifyURI = function(uri) {
    var arr = text.split(':');
    var spotifyID = arr[arr.length - 1];
    return spotifyID;
};

exports.itunesURL = function(url) {
  var arr = text.split('=');
  var itunesID = arr[arr.length - 1];
  return itunesID;
};

  // spotify.lookup({ type: 'track', id: spotifyID}, function(err, data) {
  //     if ( err ) {
  //         console.log('Error occurred: ' + err);
  //         return;
  //     }
  //     console.log(data);      
  // });