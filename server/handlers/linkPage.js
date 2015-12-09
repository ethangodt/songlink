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
      var template = fs.readFileSync(path.join(__dirname, '../templates/template.html'),'utf-8', function(err, data) {
        if (err) {
          console.error(err);
        }
      });

      var templateObj = {
        title : songFromDb.title,
        artist : songFromDb.artist,
        album_art : songFromDb.album_art,
        providers : [
          {name : 'Spotify',
            url : providers.spotify.makeUriFromId(songFromDb.spotify_id)},
          {name : 'Youtube',
           url : providers.youtube.makeLinkFromId(songFromDb.youtube_id)},
          {name : 'Itunes',
            url : songFromDb.itunes_app_uri}
        ],
        clicks : songFromDb.clicks,
        creates : songFromDb.creates
      };

      var html = Mustache.render(template, templateObj);
      res.send(html);
    }

  });
}
