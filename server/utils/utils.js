var crypto = require('crypto');
var providers = require('../providers');
var songCtrl = require('../db/controllers/songController');
var Promise = require('bluebird');
var queries = require('../queries');

module.exports = {
	addSongToDb: addSongToDb,
	build: build,
	checkDb: checkDb,
	createProvidersArray: createProvidersArray,
	createUniqueHash: createUniqueHash,
	getAlbumArtUrl: getAlbumArtUrl,
	makeSongLinkObject: makeSongLinkObject,
	makeSonglinkUrl: makeSonglinkUrl,
	pruneSong: pruneSong,
	verifyId: verifyId
};

function addSongToDb(song) {
	return new Promise(function (resolve, reject) {
		songCtrl.create(song, function (err, songFromDb) {
			if (err) {
				reject(err);
			} else {
				resolve(song);
			}
		});
	});
}

function build(song) {
	return new Promise(function (resolve, reject) {

		song.results = {};

		for (var provider in providers) {
			providers[provider].buildSearchResults(song, function(err, songFromBuild) {
				if (err) {
					reject(err);
				} else {
					for (var prov in songFromBuild.results) {
						if (Object.keys(songFromBuild.results[prov]).length !== Object.keys(queries).length) {
							return;
						}
					}
					resolve(songFromBuild);
				}
			});
		}
	});
}

function checkDb(song) {
	return new Promise(function (resolve, reject) {
		songCtrl.get(song, function (err, songFromDb) {
			if (err) {
				reject(err);
			} else {
				resolve(songFromDb);
			}
		});
	});
}

function createProvidersArray(song) {
	return [
		providers.spotify.makeTemplateObject(song),
		providers.itunes.makeTemplateObject(song),
		providers.google.makeTemplateObject(song),
		providers.youtube.makeTemplateObject(song),
		providers.deezer.makeTemplateObject(song)
	]
}

function createUniqueHash(str, parentResolve, parentReject) {

	return new Promise(function (resolve, reject) {
		resolve = parentResolve || resolve;
		reject = parentReject || reject;
		var shasum = crypto.createHash('sha1');
		shasum.update(str);
		var url_hash = shasum.digest('hex').slice(0, 5);

		checkDb({ hash_id: url_hash })
			.then(function(songFromDb) {
				if (!songFromDb) {
					resolve(url_hash);
				} else {
					return createUniqueHash(str += Date.now(), resolve, reject);
				}
			})
			.catch(reject);
	});
}

function getAlbumArtUrl(song) {
	return 	providers.spotify.getAlbumArtUrl(song, 'large') || providers.itunes.getAlbumArtUrl(song);
}

function makeSongLinkObject(song) {

	var shareLink = makeSonglinkUrl(song);

	return {
		title: song.title,
		artist: song.artist,
		album_title: song.album_title,
		album_art: providers.spotify.getAlbumArtUrl(song, 'medium') || providers.itunes.getAlbumArtUrl(song),
		source_id: song.source_id,
		source: song.source,
		share_link: shareLink
	}

}

function makeSonglinkUrl(song) {
	var host = process.env.APP_HOST || 'localhost:3000';
	return 'http://' + host + '/' + song.hash_id;
}

function pruneSong(song) {
	return new Promise(function (resolve, reject) {

		// if it doesn't have results, resolve song and return out of function
		if (!song.results) {
			//return resolve(song)
		}

		song.results_pruned = {};

		for (var provider in providers) {
			if (song.results && song.results[provider]) {
				providers[provider].pruneSearchResults(song, function(err, songFromPrune) {
					if (err) {
						reject(err);
					} else {
						if (Object.keys(songFromPrune.results_pruned).length === Object.keys(songFromPrune.results).length) {
							songFromPrune.results = undefined;
							resolve(songFromPrune);
						}
					}
				});
			}
		}
	})
}

function verifyId(song) {
	return new Promise(function (resolve, reject) {
		providers[song.source].lookupSongById(song, function (err, verifiedSong) {
			if (err) {
				reject(err);
			} else {
				resolve(verifiedSong);
			}
		});
	});
}
