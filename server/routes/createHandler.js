var songCtrl = require('../controllers/songController');
var utils = require('../utils');
var songBuilder = require('../songBuilder/songBuilder');
var hasher = require('../songBuilder/hasher');

module.exports = function (req, res) {
  // JUST FOR TESTING
  debugger;

  var testFromLink = true;
  if (testFromLink) {
    var testSong = {
      itunes_id: '541953607'
    };
  } else {
    var testSong = {
      title: 'Pyramids',
      artist: 'Frank Ocean',
      album_name: 'Channel Orange',
      spotify_id: '4QhWbupniDd44EDtnh2bFJ'
    };
  }

  var songIsNotVerified = !testSong.title;
  if (songIsNotVerified) {
    verifySong(testSong);
  } else {
    checkDb(testSong);
  }

  function verifySong(songData) {
    for (var provider in utils.providers) {
      if (songData[provider + '_id']) {
        utils.providers[provider].getData(songData[provider + '_id'], function (err, verifiedSong) {
          if (err) {
            console.error(err);
          }
          checkDb(verifiedSong);
        })
      }
    }
  }

  function checkDb(songData) {
    songCtrl.get(songData, function (err, song) {
      if (!song) {
        startBuild(songData);
      } else {
        res.send(utils.makeLinkString(song.hash_id));
      }
    })
  }

  function startBuild(songData) {
    songBuilder(songData, function (err, fullSongObj) {
      hasher.createHash(fullSongObj.title+fullSongObj.artist+fullSongObj.album_name, function(hash_id) {
        fullSongObj.hash_id = hash_id;
        addSong(fullSongObj);
      });
    });
  }

  function addSong(fullSongObj) {
    songCtrl.create(fullSongObj, function (err, songFromDb) {
      if (err) {
        console.error(err); // this is duplicate log, but will allow us to handle errors later
      }
      res.send(utils.makeLinkString(songFromDb.hash_id));
    });
  }
};
