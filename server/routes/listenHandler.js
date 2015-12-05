var songCtrl = require('../controllers/songController');
var utils = require('../utils');
var songBuilder = require('../songBuilder/songBuilder');

var Mustache = require('mustache');
var fs = require('fs');
var path = require('path');


module.exports = {
  
  render : function (req, res){ 
    
    songCtrl.get({ hash_id : req.params.id }, function(err, response) {
      if (err) console.log(err);

      var template = fs.readFileSync(path.join(__dirname, '../mustache/template.html'),'utf-8', function(err, data) {
        if (err) console.log(err);
      });
      console.log('response', response);
      var templateObj = {
        title : response.title,
        artist : response.artist,
        album_art : response.album_art,
        providers : [
          {name : 'Spotify',
            url : response.spotify_id},
          {name : 'Youtube',
            url : response.youtube_id},
          {name : 'Itunes',
            url : response.itunes_id}
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
      hash_id:1,
      spotify_id : "spotifylink.com",
      youtube_id : "youtube.com/adfasdfas"}, function(err, response){
      if (err) console.log(err);
      console.log('object written to data for testing', response);
    });

  }

};