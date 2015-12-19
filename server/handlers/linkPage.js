var fs = require('fs');
var Mustache = require('mustache');
var path = require('path');
var providers = require('../providers');
var songCtrl = require('../db/controllers/songController');
var utils = require('../utils/utils');

module.exports = {
  render: render
};

function render(req, res) {
  songCtrl.get({ hash_id : req.params.id }, function(err, songFromDb) {
    if (err || !songFromDb) {
      res.status(404).sendFile(path.join(__dirname, '../templates/404.html'));
    } else if (providers[req.cookies.providerPreference] && req.cookies.providerPreference !== 'none') { // ensures we support whatever string is set on cookie
      var provider = req.cookies.providerPreference;
      if (provider === 'youtube') {
        if (!songFromDb[provider+'_id']) {
          sendNonProvider(req, res, songFromDb);
        } else {
          res.status(302).redirect(providers[provider].makeLinkFromId(songFromDb[provider + '_id']));
        }
      } else if (provider === 'itunes') {
        if (!songFromDb[provider+'_id']) {
          sendNonProvider(req, res, songFromDb);
        } else {
          var itunesLink = songFromDb.itunes_app_uri || songFromDb.itunes_store_uri;
          res.status(302).redirect(itunesLink);
        }
      } else if (provider === 'spotify'){
        if (!songFromDb[provider+'_id']) {
          sendNonProvider(req, res, songFromDb);
        } else {
          res.status(302).redirect(providers[provider].makeUriFromId(songFromDb[provider + '_id']));
        }
      }
    } else {
      sendNonProvider(req, res, songFromDb);
    }
  });
}

function sendNonProvider (req, res, songFromDb) {
  var template = fs.readFileSync(path.join(__dirname, '../templates/linkTemplate/template.html'),'utf-8', function(err, data) {
    if (err) {
      console.error(err);
    }
  });

  var templateObj = {
    pageUrl : utils.makeSongLinkUrl(req.headers.host, songFromDb.hash_id),
    title : songFromDb.title,
    artist : songFromDb.artist,
    album_art : songFromDb.spotify_images ? songFromDb.spotify_images.medium_image.url : songFromDb.album_art,
    providers : createProvidersArray(songFromDb),
    clicks : songFromDb.clicks,
    creates : songFromDb.creates
  };

  var html = Mustache.render(template, templateObj);
  res.send(html);
}

// todo make function to determine provider text
//

function createProvidersArray (song) {

  function iTunesText(song) {
    if (!song.itunes_id) {
      return undefined;
    } else if (song.itunes_app_uri) {
      return 'Play now in Apple Music';
    } else {
      return 'Open now in iTunes Store';
    }
  }

  function iTunesUrl(song) {
    if (!song.itunes_id) {
      return undefined;
    } else if (song.itunes_app_uri) {
      return song.itunes_app_uri;
    } else {
      return song.itunes_store_uri;
    }
  }

  var providersArray = [{
    provider: 'spotify',
    icon: 'spotify',
    url : song.spotify_id ? providers.spotify.makeUriFromId(song.spotify_id) : undefined,
    text : song.spotify_id ? 'Play now in Spotify' : 'Not available on Spotify',
    className : song.spotify_id ? 'fullWidth spotify' : 'fullWidth disabled spotify'
  },
  {
    provider: 'youtube',
    icon: 'youtube',
    url : song.youtube_id ? providers.youtube.makeLinkFromId(song.youtube_id) :undefined,
    text : song.youtube_id ? 'Play now in Youtube' : 'Not available on Youtube',
    className : song.youtube_id ? 'fullWidth youtube' : 'fullWidth disabled youtube'
  },
  {
    provider: 'itunes',
    icon: 'apple',
    url : iTunesUrl(song),
    text : iTunesText(song),
    className : song.itunes_id ? 'fullWidth iTunes' : 'fullWidth disabled iTunes'
  }];

  return providersArray;

}

