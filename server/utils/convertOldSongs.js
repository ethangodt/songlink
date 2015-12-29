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

      songs[i].source = 'itunes';
      songs[i].source_id = songs[i].itunes_id;

      // console.log(songs[i].title, songs[i].artist, songs[i].album_title);

      utils.verifyId(songs[i])
        .then(utils.build)
        .then(function(songFromBuild) {
          songFromBuild.save(function() {
            completed++;
            console.log('Completed a song');
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

