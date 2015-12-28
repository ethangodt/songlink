require('dotenv').load();

var mongoose = require('mongoose');
var utils = require('./utils');
var providers = require('../providers');
var controller = require('../db/controllers/songController');

var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/songlink';

mongoose.connect(mongoUrl);

controller.getAll(function (err, songs) {

  var found = 0;
  var completed = 0;

  for (var i = 0; i < songs.length; i++) {
    if (!songs[i].lookup && !songs[i].results) {

      found++;
      console.log('Found old song, number ' + i + 'of ' + songs.length);

      if (songs[i].itunes_id) {
        songs[i].source = 'itunes';
        songs[i].source_id = songs[i].itunes_id;
      } else if (songs[i].spotify_id) {
        songs[i].source = 'spotify';
        songs[i].source_id = songs[i].spotify_id;
      }

      var hash_id = songs[i].hash_id;

      utils.verifyId(songs[i])
        .then(utils.build)
        .then(function(songFromBuild) {
          songFromBuild.hash_id = hash_id;
          songFromBuild.save(function() {
            completed++;
            console.log('Completed number' + i);
            if (completed === found) {
              console.log('done');
              mongoose.disconnect();
            }
          });
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  }
});

