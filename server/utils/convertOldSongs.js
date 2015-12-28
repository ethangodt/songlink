var mongoose = require('mongoose');
var utils = require('./utils');
var providers = require('../providers');
var controller = require('../db/controllers/songController');

var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/songlink';

mongoose.connect(mongoUrl);

controller.getAll(function (err, songs) {

  for (var i = 0; i < songs.length; i++) {
    if (!songs[i].lookup && !songs[i].results) {
      if (songs[i].itunes_id) {
        songs[i].source = 'itunes';
        songs[i].source_id = songs[i].itunes_id;
      } else if (songs[i].spotify_id) {
        songs[i].source = 'spotify';
        songs[i].source_id = songs[i].spotify_id;
      }

      if (i === 0) console.log(songs[i]);

      utils.verifyId(songs[i])
        .then(utils.build)
        .then(function(songFromBuild) {
          songFromBuild.save();
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  }
});

