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

  var provider;

  if (!req.cookies.providerPreference || req.cookies.providerPreference === 'none' || !providers[req.cookies.providerPreference]) {
    provider = 'none';
  } else {
    provider = req.cookies.providerPreference;
  }

  songCtrl.get({ hash_id : req.params.id }, function(err, songFromDb) {
    if (songFromDb) {
      sendProvider(req, res, songFromDb, provider);
    } else {
      res.status(404).sendFile(path.join(__dirname, '../templates/404.html'));
    }
  });
}

function sendProvider (req, res, song, provider) {
  
  var template = fs.readFileSync(path.join(__dirname, '../templates/linkTemplate/template.html'),'utf-8', function(err, data) {
    if (err) {
      console.error(err);
    }
  });

  var topSpotifyResult = providers.spotify.getTopSpotifyResult(song);
  var topItunesResult = providers.itunes.getTopItunesResult(song);
  var topYoutubeResult = providers.youtube.getTopYoutubeResult(song);

  var providerUrl;

  if (provider === 'youtube') {
    providerUrl = providers.youtube.makeLinkFromId(topYoutubeResult.id);
  } else if (provider === 'itunes') {
    providerUrl = providers.itunes.makeLink(topItunesResult.trackId);
  } else if (provider === 'spotify') {
    providerUrl = providers.spotify.makeUriFromId(topSpotifyResult.id);
  }

  var templateObj = {
    pageUrl : utils.makeSongLinkUrl(req.headers.host, song.hash_id),
    title : song.title,
    artist : song.artist,
    album_art : providers.spotify.getAlbumArtUrl(song, 'large') || providers.itunes.getAlbumArtUrl(song),
    providers : createProvidersArray(topSpotifyResult, topItunesResult, topYoutubeResult),
    providerUrl : providerUrl,
    provider : provider
  };

  var html = Mustache.render(template, templateObj);
  res.send(html);
}

function createProvidersArray (spotifySong, itunesSong, youtubeSong) {

  return [
  {
    provider: 'spotify',
    icon: 'spotify',
    url : spotifySong ? providers.spotify.makeUriFromId(spotifySong.id) : undefined,
    text : spotifySong ? 'Play now in Spotify' : 'Not available on Spotify',
    className : spotifySong ? 'fullWidth spotify' : 'fullWidth disabled spotify'
  },
  {
    provider: 'youtube',
    icon: 'youtube-play',
    url : youtubeSong ? providers.youtube.makeLinkFromId(youtubeSong.id) :undefined,
    text : youtubeSong ? 'Play now in YouTube' : 'Not available on YouTube',
    className : youtubeSong ? 'fullWidth youtube' : 'fullWidth disabled youtube'
  },
  {
    provider: 'itunes',
    icon: 'apple',
    url : itunesSong ? providers.itunes.makeLink(itunesSong) : undefined,
    text : itunesSong ? providers.itunes.makeText(itunesSong) : 'Not available on iTunes',
    className : itunesSong ? 'fullWidth iTunes' : 'fullWidth disabled iTunes'
  }];

}

