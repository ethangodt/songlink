var itunes = require('./providerModules/itunes');
var spotify = require('./providerModules/spotify');
var youtube = require('./providerModules/youtube');

// this function simply takes hash_id and makes a song link string
var makeSongLinkUrl = function (host, hash_id) {
  return 'http://' + host + '/' + hash_id;
};

var providers = {
  spotify: {
    getData: spotify,
    makeLinkFromId: function (spotify_id) {
      return 'spotify:track:' + spotify_id;
    }
  },
  itunes: {
    getData: itunes,
    makeLinkFromId: function (itunes_id) {
      return 'https://itun.es/us/' + itunes_id;
    }
  },
  youtube: {
   getData: youtube,
   makeLinkFromId: function (youtube_id) {
     return 'https://www.youtube.com/watch?v=' + youtube_id;
   }
  }
};

module.exports = {
  providers: providers,
  makeLinkString: makeSongLinkUrl
};
