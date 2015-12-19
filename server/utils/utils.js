var crypto = require('crypto');
var providers = require('../providers');
var songCtrl = require('../db/controllers/songController');

module.exports = {
  addSongToDb: addSongToDb,
  build: build,
  checkDb: checkDb,
  createHash: createHash,
  getNumberOfIds: getNumberOfIds,
  makeSongLinkUrl: makeSongLinkUrl,
  verifyId: verifyId
};

function addSongToDb(song, callback) {
  songCtrl.create(song, function (err, songFromDb) {
    if (!songFromDb || err) {
      callback(err);
    } else {
      callback(null, songFromDb);
    }
  });
}

function build(song, callback) {
  var providersList = Object.keys(providers);
  providersList.forEach(function (provider) {
    if (!song[provider + '_id']) {
      providers[provider].fetchSongBySearch(song, function(err, songFromSearch) {
        if (!songFromSearch || err) {
          callback(new Error('No song found for: '+provider, err));
        } else {
          // after async process, if songObject has all providers invoke callback
          if (getNumberOfIds(songFromSearch) === providersList.length) {
            callback(null, songFromSearch);
          }
        }
      });
    }
  });
}

function checkDb(song, callback) {
  songCtrl.get(song, function (err, songFromDb) {
    if (!songFromDb || err) {
      callback(new Error('Song not found in db'), null);
    } else {
      callback(null, songFromDb);
    }
  });
}

function createHash(song, attempt, callback) {
  var str = song.title+song.artist+song.album_title;
  if (attempt !== 0) {
    str += Date.now();
  }
  attempt++;
  var shasum = crypto.createHash('sha1');
  shasum.update(str);
  var url_hash = shasum.digest('hex').slice(0, 5);
  // is this the right error handling below?
  songCtrl.get({ hash_id: url_hash }, function (err, songFromDb) {
    if (!songFromDb) {
      song.hash_id = url_hash;
      callback(song);
    } else {
      createHash(song, attempt++, callback);
    }
  })
}

function getNumberOfIds(songData) {
  // just gets the number of ids to determine the number of providers this song currently supports
  var keys = Object.keys(songData);
  var keyExpression = /(\w+(_id))/i;
  var ids = keys.filter(function (key) {
    return keyExpression.test(key);
  });
  return ids.length;
}

function makeSongLinkUrl(host, hash_id) {
  return 'http://' + host + '/' + hash_id;
}

function verifyId(song, callback) {
  for (var provider in providers) {
    if (song[provider + '_id']) {
      providers[provider].fetchSongById(song[provider + '_id'], function (err, verifiedSong) {
        if (err) {
          callback(new Error('Could not verify song by' + provider + 'ID', null));
        } else {
          callback(null, verifiedSong);
        }
      })
    }
  }
}
