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
      res.status(404).send('Sorry cant find that url!');
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
          res.status(302).redirect(songFromDb.itunes_app_uri);
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
  var template = fs.readFileSync(path.join(__dirname, '../templates/linkTemplate/template-kurt.html'),'utf-8', function(err, data) {
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


function createProvidersArray (song) {

  var providersArray = [{
    provider: 'spotify', 
    url : song.spotify_id ? providers.spotify.makeUriFromId(song.spotify_id) : undefined,
    text : song.spotify_id ? 'Play now in Spotify' : 'Not available on Spotify',
    className : song.spotify_id ? 'fullWidth spotify' : 'fullWidth disabled spotify'
  },{
    provider: 'youtube', 
    url : song.youtube_id ? providers.youtube.makeLinkFromId(song.youtube_id) :undefined,
    text : song.youtube_id ? 'Play now in Youtube' : 'Not available on Youtube',
    className : song.youtube_id ? 'fullWidth youtube' : 'fullWidth disabled youtube'
  },{
    provider: 'itunes', 
    url : song.itunes_id ? song.itunes_app_uri : undefined,
    text : song.itunes_id ? 'Play now in Apple Music' : 'Not available on Itunes',
    className : song.itunes_id ? 'fullWidth itunes' : 'fullWidth disabled itunes'
  }];

  return providersArray;

}

