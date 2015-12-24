var crypto = require('crypto');
var providers = require('../providers');
var songCtrl = require('../db/controllers/songController');
var Promise = require('bluebird');

module.exports = {
  addSongToDb: addSongToDb,
  build: build,
  checkDb: checkDb,
  createHash: createHash,
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
        resolve(song);
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

          providers[provider].fetchSearchResults(song, query, queryType, function(err, songFromBuild) {
            if (err) {
              reject(err);
            } else {
              for (provider in songFromBuild.results) {
                if (songFromBuild.results[provider].queryTypes.length !== song.searches.length) {
                  return;
                }
              }
              resolve(songFromBuild);
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

function getAlbumArtUrl(song) {
  if (song.source === 'spotify') {
    return song.lookup.album.images[1].url;
  } else {
    var topResult = getTopSpotifyResult(song);
    return topResult.album.images[1].url;
  }
}

function getTopSpotifyResult(song) {
  if (song.source === 'spotify') {
    return song.lookup;
  } else {
    return song.results.spotify.full.results.length ? song.results.spotify.full.results[0] : song.results.spotify.partial.results[0];
  }
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
    album_art: getAlbumArtUrl(song),
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
  var query;

  if (queryType === 'full') {
    query = song.title + ' ' + song.artist + ' ' + song.album_title;
  } else if (queryType === 'partial') {
    query = song.title + ' ' + song.artist;
  }

  return query.toLowerCase();
}

function verifyId(song) {
  return new Promise(function (resolve, reject) {
    providers[song.source].lookupSongById(song, function (err, verifiedSong) {
      if (err) {
        reject(err);
      } else {
        resolve(verifiedSong);
      }
    })
  });
}
