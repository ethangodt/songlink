
var songCtrl = require('../db/controllers/songController');
var utils = require('../utils/utils');

module.exports = function (req, res) {

  songCtrl.getAll(function(err, entries) {

    entries.forEach(function(entry) {
      songCtrl.get({hash_id: entry.hash_id}, function (err, songFromDb) {
        if (err) {
          console.log(err)
        }
        utils.pruneSong(songFromDb)
          .then(function(prunedSong) {
            console.log('saved song:', prunedSong.results_pruned.itunes.trackName)
            prunedSong.save()
          })
      })

    })
    
    res.send(entries)

  })

  // reads data from json, take hash_id, findOne, check if has results
    // if yes, do prune and save steps
    // remove fluff
    // remove from json



  // returns a list of title, hash_id that were successfully updated
  // also appends any errors that were found

}
