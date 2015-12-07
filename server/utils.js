// this function simply takes hash_id and makes a song link string
var makeLinkString = function (hash_id) {
  return 'http://songl.ink/' + hash_id;
};

var makeYoutubeUrl = function (youtube_id) {
  return 'https://www.youtube.com/watch?v=' + youtube_id;
}

var makeSpotifyUrl = function (spotify_id) {
  return 'spotify:track:' + spotify_id;
}

var makeItunesUrl = function (itunes_id) {
  return 'https://itun.es/us/sSXQ-?i=' + itunes_id;
}


module.exports = {
  makeLinkString: makeLinkString,
  makeYoutubeUrl : makeYoutubeUrl,
  makeSpotifyUrl : makeSpotifyUrl,
  makeItunesUrl : makeItunesUrl
};
