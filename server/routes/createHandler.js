var songCtrl = require('../controllers/songController');
var utils = require('../utils');
var songBuilder = require('../songBuilder/songBuilder');
var hasher = require('../songBuilder/hasher');

module.exports = function (req, res) {
  // depending on the specific case, clientData could be an object with some song data, or it could be a raw provider url/uri
  // todo should make this so that song data from searches is not passed up from the client, but instead pulled from redis or something
  // todo refactor this so that the function declarations don't happen in the string condition

  // todo setup body parser and think about handling string payloads
  // typeof req.body === 'string'
  if (true) {
    // todo call Stobie's function which will identify the link type and return an object with track id AND VERIFY THE FUNCTION
    // todo make sure to add album name to make searches more specific

    var songData = {
      title: 'Pyramids',
      artist: 'Frank Ocean',
      album_name: 'Channel Orange',
      spotify_id: '4QhWbupniDd44EDtnh2bFJ'
    };

    (function checkDb(songData) {
      songCtrl.get(songData, function (err, song) {
        if (!song) {
          startBuild(songData);
        } else {
          // res.send(utils.makeLinkString(song.hash_id));
        }
      })
    })(songData); // iife for testing - change to Stobie's function when we're solid

    function startBuild(songData) {
      songBuilder(songData, function (err, fullSongObj) {
        res.send(fullSongObj);
        hasher.createHash(fullSongObj.title+fullSongObj.artist+fullSongObj.album_name, function(urlhash) {
          console.log(urlhash);
          //addSong(fullSongObj)
        });
      });
    }
    //function addSong(fullSongObj) {
    //  songCtrl.create(fullSongObj, function (err) {
    //    console.error(err); // this is duplicate log, but will allow us to handle errors later
    //  });
    //}
  }
};

