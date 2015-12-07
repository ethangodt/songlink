var songCtrl = require('../controllers/songController');
var utils = require('../utils');
var songBuilder = require('../songBuilder/songBuilder');

var Mustache = require('mustache');
var fs = require('fs');
var path = require('path');


module.exports = {
  
  render : function (req, res){ 
    console.log('id', req.params.id);
    songCtrl.get({ hash_id : req.params.id }, function(err, response) {
      if (err) console.log(err);

      var template = fs.readFileSync(path.join(__dirname, '../Mustache/template.html'),'utf-8', function(err, data) {
        if (err) console.log(err);
      });

      if (response === null) {
        res.status(404).send('Sorry cant find that url!');
      }

      var templateObj = {
        title : response.title,
        artist : response.artist,
        album_art : response.album_art,
        providers : [
          {name : 'Spotify',
            url : utils.makeSpotifyUrl(response.spotify_id)},
          {name : 'Youtube',
            url : utils.makeYoutubeUrl(response.youtube_id)},
          {name : 'Itunes',
            url : utils.makeItunesUrl(response.itunes_id)}
        ],
        clicks : response.clicks,
        creates : response.creates
      };

      var html = Mustache.render(template, templateObj);
      res.send(html);
    }); 
  },
  test : function (req, res) {

    songCtrl.create(
      {title:"Hello",
      artist:"Adele",
      album_art:"http://images.musictimes.com/data/images/full/47589/adele-25-album-artwork.jpg?w=775", 
      hash_id: '1',
      spotify_id : "spotify:track:0ENSn4fwAbCGeFGVUbXEU3",
      youtube_id : "https://www.youtube.com/watch?v=YQHsXMglC9A",
      itunes_id : "https://itun.es/us/sSXQ-?i=1051400980"}, function(err, response){
      if (err) console.log(err);
      console.log('object written to data for testing', response);
    });

    res.send("");
  }

};