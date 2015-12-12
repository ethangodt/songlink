var fs = require('fs');
var Mustache = require('mustache');
var path = require('path');
var providers = require('../providers');
var songCtrl = require('../db/controllers/songController');

module.exports = {
  render: render
};

function render(req, res) {
  songCtrl.get({ hash_id : req.params.id }, function(err, songFromDb) {
    if (err || !songFromDb) {
      res.status(404).send('Sorry cant find that url!');
    } else if (providers[req.cookies.providerPreference]) { // ensures we support whatever string is set on cookie
      var provider = req.cookies.providerPreference;
      res.status(302).redirect(providers[provider].makeUriFromId(songFromDb[provider + '_id']));
    } else {
      var template = fs.readFileSync(path.join(__dirname, '../linkTemplate/template.html'),'utf-8', function(err, data) {
        if (err) {
          console.error(err);
        }
      });

      var templateObj = {
        title : songFromDb.title,
        artist : songFromDb.artist,
        album_art : songFromDb.album_art,
        providers : createProvidersArray(songFromDb),
        clicks : songFromDb.clicks,
        creates : songFromDb.creates
      };

      var html = Mustache.render(template, templateObj);
      res.send(html);
    }

  });
}

function createProvidersArray (song) {

  var providersArray = [{
    name: 'Spotify', 
    url : song.spotify_id ? providers.spotify.makeUriFromId(song.spotify_id) : undefined,
    text : song.spotify_id ? 'play now in Spotify' : 'Not Available on Spotify',
    className : song.spotify_id ? 'fullWidth spotify' : 'greyedOut spotify'
  },{
    name: 'Youtube', 
    url : song.youtube_id ? providers.youtube.makeLinkFromId(song.youtube_id) :undefined,
    text : song.youtube_id ? 'play now in Youtube' : 'Not Available on Youtube',
    className : song.youtube_id ? 'fullWidth youtube' : 'greyedOut youtube'
  },{
    name: 'Itunes', 
    url : song.itunes_id ? song.itunes_app_uri : undefined,
    text : song.itunes_id ? 'play now in Apple Music' : 'Not Available on Itunes',
    className : song.itunes_id ? 'fullWidth apple' : 'greyedOut apple'
  }];

  return providersArray;

}

