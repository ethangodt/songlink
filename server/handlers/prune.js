var songCtrl = require('../db/controllers/songController');
var utils = require('../utils/utils');

module.exports = function (req, res) {
  songCtrl.getSongWithTooMuchData(function(err, songFromDb) {
    if (err) {
      res.sendStatus(500)//.send('ERROR: ' + err)
    }

    if (songFromDb) {
      utils.pruneSong(songFromDb)
      .then(function(prunedSong) {
        prunedSong.results = undefined;
        prunedSong.save();
        res.sendStatus(200)//.send('hash_id pruned:' + prunedSong.hash_id)
      })
    } else {
      res.sendStatus(500)//.send('ERROR: No song found in db with too much data')
    }

  })
};
