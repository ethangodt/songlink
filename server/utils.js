var itunes = require('./providerModules/itunes');
var spotify = require('./providerModules/spotify');
var youtube = require('./providerModules/youtube');

// this function simply takes hash_id and makes a song link string
var makeLinkString = function (hash_id) {
  return 'http://songl.ink/' + hash_id;
};

var makeYoutubeUrl = function (youtube_id) {
  return 'https://www.youtube.com/watch?v=' + youtube_id;
};

var makeSpotifyUrl = function (spotify_id) {
  return 'spotify:track:' + spotify_id;
};

var makeItunesUrl = function (itunes_id) {
  return 'https://itun.es/us/' + itunes_id;
};


var providers = {
  spotify: {
    getData: spotify
  },
  itunes: {
    getData: itunes
  }
  //youtube: {
  //  getData: youtube
  //}
};

module.exports = {
  providers: providers,
  makeLinkString: makeLinkString,
  makeYoutubeUrl : makeYoutubeUrl,
  makeSpotifyUrl : makeSpotifyUrl,
  makeItunesUrl : makeItunesUrl
};
