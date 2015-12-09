var songCtrl = require('../controllers/songController');
var utils = require('../utils');
var songBuilder = require('../songBuilder/songBuilder');

var Mustache = require('mustache');
var fs = require('fs');
var path = require('path');


module.exports = {
  render : function (req, res){
    songCtrl.get({ hash_id : req.params.id }, function(err, song) {
      if (err) console.log(err);
      if (song === null) {
        res.status(404).send('Sorry cant find that url!');
      } else if (utils.providers[req.cookies.providerPreference]) { // ensures we support whatever string is set on cookie
        var provider = req.cookies.providerPreference;
        res.status(302).redirect(utils.providers[provider].makeLinkFromId(song[provider + '_id']));
      } else {
        var template = fs.readFileSync(path.join(__dirname, '../Mustache/template.html'),'utf-8', function(err, data) {
          if (err) console.log(err);
        });
        var templateObj = {
          title : song.title,
          artist : song.artist,
          album_art : song.album_art,
          providers : [
            {name : 'Spotify',
              url : utils.providers.spotify.makeLinkFromId(song.spotify_id)},
            // commented out because the youtube function are not completed yet
            //{name : 'Youtube',
            //  url : utils.providers.youtube.makeLinkFromId(song.youtube_id)},
            {name : 'Itunes',
              url : utils.providers.itunes.makeLinkFromId(song.itunes_id)}
          ],
          clicks : song.clicks,
          creates : song.creates
        };

        var html = Mustache.render(template, templateObj);
        res.send(html);
      }

    });
  },

  test : function (req, res) {
    songCtrl.create(
      {title:"Hello",
      artist:"Adele",
      album_art:"http://images.musictimes.com/data/images/full/47589/adele-25-album-artwork.jpg?w=775",
      hash_id: '1',
      spotify_id : "0ENSn4fwAbCGeFGVUbXEU3",
      youtube_id : "YQHsXMglC9A",
      itunes_id : "sSXQ-?i=1051400980"}, function(err, response){
      if (err) console.log(err);
      console.log('object written to data for testing', response);
    });

    res.send("");
  }
};
