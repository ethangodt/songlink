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
      checkProvider(req, res, songFromDb, provider);
    } else {
      sendProvider(req, res, songFromDb, 'none');
    }
  });
}

function checkProvider (req, res, songFromDb, provider) {
  if (!songFromDb[provider+'_id']) {
    sendProvider(req, res, songFromDb, 'none');
  } else {
    sendProvider(req, res, songFromDb, provider);
  }
}

function sendProvider (req, res, songFromDb, provider) {
  var template = fs.readFileSync(path.join(__dirname, '../templates/linkTemplate/template.html'),'utf-8', function(err, data) {
    if (err) {
      console.error(err);
    }
  });

  var providerUrl = undefined;

  if (provider === 'youtube') {
    providerUrl = providers['youtube'].makeLinkFromId(songFromDb['youtube_id']);
  } else if (provider === 'itunes') {
    providerUrl = songFromDb.itunes_app_uri || songFromDb.itunes_store_uri;
  } else if (provider === 'spotify') {
    providerUrl = providers['spotify'].makeUriFromId(songFromDb['spotify_id']);
  }

  var templateObj = {
    pageUrl : utils.makeSongLinkUrl(req.headers.host, songFromDb.hash_id),
    title : songFromDb.title,
    artist : songFromDb.artist,
    album_art : utils.getAlbumArtUrl(songFromDb),
    providers : createProvidersArray(songFromDb),
    providerUrl : providerUrl,
    provider : provider
  };

  var html = Mustache.render(template, templateObj);
  res.send(html);
}

function createProvidersArray (song) {

  function iTunesText(song) {
    if (!song.itunes_id) {
      return 'Not available on iTunes';
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
    icon: 'youtube-play',
    url : song.youtube_id ? providers.youtube.makeLinkFromId(song.youtube_id) :undefined,
    text : song.youtube_id ? 'Play now in YouTube' : 'Not available on YouTube',
    className : song.youtube_id ? 'fullWidth youtube' : 'fullWidth disabled youtube'
  },
  {
    provider: 'itunes',
    icon: 'apple',
    url : iTunesUrl(song) ? iTunesUrl(song) : undefined,
    text : iTunesText(song) ? 'Play now in iTunes' : 'Not available on iTunes',
    className : song.itunes_id ? 'fullWidth iTunes' : 'fullWidth disabled iTunes'
  }];

  return providersArray;

}

