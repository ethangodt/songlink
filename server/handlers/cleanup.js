var songCtrl = require('../db/controllers/songController');
var utils = require('../utils/utils');

module.exports = {
	prune: prune,
	updateOldSongs: updateOldSongs
}

function prune(req, res) {
  songCtrl.getSongWithTooMuchData(function(err, songFromDb) {
    if (err) {
      res.sendStatus(500)
    }

    if (songFromDb) {
      utils.pruneSong(songFromDb)
      .then(function(prunedSong) {
        prunedSong.results = undefined;
        prunedSong.save();
        res.sendStatus(200)
      })
    } else {
      res.sendStatus(500)
    }

  })
}

function updateOldSongs(req, res) {
	songCtrl.getOldSong(function(err, songFromDb) {
		if (err) {
			res.sendStatus(500)
		}

		if (songFromDb) {
			console.log('Pulled ' + songFromDb.title + ' from db')
			songFromDb.source = 'itunes'
			songFromDb.source_id = songFromDb.itunes_id
			utils.verifyId(songFromDb)
				.then(utils.build)
				.then(utils.pruneSong)
				.then(function(prunedSong) {
					console.log(prunedSong)
					prunedSong.album_art = undefined
					prunedSong.album_art_size = undefined
					prunedSong.itunes_app_uri = undefined
					prunedSong.itunes_store_uri = undefined
					prunedSong.spotify_id = undefined
					prunedSong.spotify_images = undefined
					prunedSong.youtube_id = undefined
					prunedSong.itunes_id = undefined
					prunedSong.save(function() {
						console.log('Success; updated ' + prunedSong.title)
						res.sendStatus(200)
					})
				})
				.catch(function(error) {
					songFromDb.remove();
					console.log('Error; removed ' + songFromDb.title + ' from db')
					res.sendStatus(200);
				})
		} else {
			res.sendStatus(500)
		}
	})
}
