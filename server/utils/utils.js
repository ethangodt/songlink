var crypto = require('crypto');
var providers = require('../providers');
var songCtrl = require('../db/controllers/songController');
var Promise = require('bluebird');

module.exports = {
  addSongToDb: addSongToDb,
  build: build,
  checkDb: checkDb,
  createHash: createHash,
  getNumberOfIds: getNumberOfIds,
  makeSongLinkObject: makeSongLinkObject,
  makeSongLinkUrl: makeSongLinkUrl,
  makeQuery: makeQuery,
  verifyId: verifyId
};

function addSongToDb(song) {
  return new Promise(function (resolve, reject) {
    songCtrl.create(song, function (err, songFromDb) {
      if (err) {
        reject(err);
      } else {
        resolve(songFromDb);
      }
    });
  });
}

function build(song, callback) {
  return new Promise(function (resolve, reject) {
    song.searches = [];
    song.results = {};
    for (var provider in providers) {
      if (provider !== song.source) {
        
        song.searches.push(provider);

        song.results[provider] = {};
        song.results[provider].queryTypes = [];

        var queryTypes = ['full', 'partial'];

        queryTypes.forEach(function(queryType) {
          var query = makeQuery(song, queryType);

          song.results[provider][queryType] = {};
          song.results[provider][queryType].query = query;

          providers[provider].fetchSearchResults(query, function(err, results) {
            if (err) {
              reject(err);
            } else {
              song.results[provider].queryTypes.push(queryType)
              song.results[provider][queryType].results = results;
              
              if (song.results[provider].queryTypes.length === queryTypes.length) {
                if (song.searches.length === Object.keys(providers).length - 1) {
                  resolve(song);
                }
              }
            }
          });
        });        
      }
    }
  });
}

function checkDb(lookup) {
  return new Promise(function (resolve, reject) {
    songCtrl.get(lookup, function (err, songFromDb) {
      if (err) {
        reject(err);
      } else {
        resolve(songFromDb);
      }
    });
  });
}

function createHash(song) {

  return new Promise(function (resolve, reject) {

    var makeHash = function(str, attempt) {

      var shasum = crypto.createHash('sha1');
      shasum.update(str);
      var url_hash = shasum.digest('hex').slice(0, 5);

      return checkDb({ hash_id: url_hash })
        .then(function(songFromDb) {
          if (!songFromDb) {
            return url_hash;
          } else {
            return makeHash(str =+ Date.now());
          }
        })
        .catch(reject);
    }
    
    var str = song.title + song.artist + song.album_title;
    
    makeHash(str)
      .then(function(hash_id) {
        song.hash_id = hash_id;
        resolve(song);
      });
  });
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

function makeSongLinkObject(song, hostname) {
  
  if (hostname.slice(0,4) === "www.") {
    hostname = hostname.slice(4);
  }

  var url = makeSongLinkUrl(hostname, song.hash_id);

  return {
    title: song.title,
    artist: song.artist,
    album_title: song.album_title,
    album_art: song.album_art,
    source_id: song.source_id,
    source: song.source,
    share_link: url
  }

  return song;

}

function makeSongLinkUrl(host, hash_id) {
  return 'http://' + host + '/' + hash_id;
}

function makeQuery(song, queryType) {
  if (queryType === 'full') {
    return song.title + ' ' + song.artist + ' ' + song.album_title;
  } else if (queryType === 'partial') {
    return song.title + ' ' + song.artist;
  }
}

function verifyId(song) {
  //TODO: have this do a lookup on whatever is "source" and append a lookup object
  return new Promise(function (resolve, reject) {
    if (song.title) {
      resolve(song);
    } else {
      providers[song.source].lookupSongById(song.source_id, function (err, verifiedSong) {
        if (err) {
          reject(err);
        } else {
          song.lookup = verifiedSong;
          resolve(verifiedSong);
        }
      })
    }
  });
}
