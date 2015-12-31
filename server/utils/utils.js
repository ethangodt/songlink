var crypto = require('crypto');
var providers = require('../providers');
var songCtrl = require('../db/controllers/songController');
var Promise = require('bluebird');

module.exports = {
  addSongToDb: addSongToDb,
  build: build,
  checkDb: checkDb,
  createUniqueHash: createUniqueHash,
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

function build(song) {
  return new Promise(function (resolve, reject) {

    song.results = {};

    for (var provider in providers) {
      if (provider !== song.source) {

        song.results[provider] = {};

        var queryTypes = ['full', 'partial', 'full-punc-keywords', 'full-albumParensBrackets', 'full-allParensBrackets', 'partial-punc-keywords', 'partial-allParensBrackets'];

        queryTypes.forEach(function(queryType) {
          var query = makeQuery(song, queryType);

          providers[provider].fetchSearchResults(song, query, queryType, function(err, songFromBuild) {
            if (err) {
              reject(err);
            } else {
              for (provider in songFromBuild.results) {
                if (Object.keys(songFromBuild.results[provider]).length !== queryTypes.length) {
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

function makeSongLinkObject(song) {

  var shareLink = makeSongLinkUrl(song.hash_id);

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

function makeSongLinkUrl(hash_id) {
  var host = process.env.APP_HOST || 'localhost:3000';
  return 'http://' + host + '/' + hash_id;
}

function makeQuery(song, queryType) {
  var query;

  switch (queryType) {
    case 'full':
      query = song.title + ' ' + song.artist + ' ' + song.album_title;

      break;

    case 'partial':
      query = song.title + ' ' + song.artist;

      break;

    case 'full-punc-keywords':
      query = song.title + ' ' + song.artist + ' ' + song.album_title;

      // Remove punctation (no inside content): parens, brackets, pound and ampersand
      query = query.replace(/[&#\[\]()]/gi, ' ');

      // Remove '- Single'
      query = query.replace(/- Single/g, ' ');

      // Remove 'feat.'
      query = query.replace(/feat\./g, '');

      // Remove 'Pt.'
      query = query.replace(/Pt\./g, '');

      // Remove 'Pts.'
      query = query.replace(/Pts\./g, '');

      // Remove numbers
      query = query.replace(/\d/g, '');

      // Remove ' - '
      query = query.replace(/ - /g, ' ');

      break;

    case 'full-albumParensBrackets':
      // Remove parens and contents inside parens of album title
      query = song.album_title.replace(/ *\([^)]*\) */g, ' ');

      // Remove brackets and contents inside brackets of album title
      query = query.replace(/ *\[[^)]*\] */g, ' ');

      //Remove anything after a space-dash-space of album title
      query = query.replace(/ - (.*)/, ' ');

      // Combine title, artist and new album title
      query = song.title + ' ' + song.artist + ' ' + query;

      break;

    case 'full-allParensBrackets':
      //Remove anything after a space-dash-space in title, artist and album
      var title = song.title.replace(/ - (.*)/, ' ');
      var artist = song.artist.replace(/ - (.*)/, ' ');
      var album = song.album_title.replace(/ - (.*)/, ' ');

      query = title + ' ' + artist + ' ' + album;

      // Remove parens and contents inside parens
      query = query.replace(/ *\([^)]*\) */g, ' ');

      // Remove brackets and contents inside brackets
      query = query.replace(/ *\[[^)]*\] */g, ' ');


      break;

    case 'partial-punc-keywords':
      query = song.title + ' ' + song.artist

      // Remove punctation (no inside content): parens, brackets, pound and ampersand
      query = query.replace(/[&#\[\]()]/gi, ' ');

      // Remove ' - '
      query = query.replace(/ - /g, ' ');

      // Remove '- Single'
      query = query.replace(/- Single/g, ' ');

      // Remove 'feat.'
      query = query.replace(/feat./g, ' ');

      break;

    case 'partial-allParensBrackets':
      //Remove anything after a space-dash-space in title and artist
      var title = song.title.replace(/ - (.*)/, ' ');
      var artist = song.artist.replace(/ - (.*)/, ' ');

      query = title + ' ' + artist;

      // Remove parens and contents inside parens
      query = query.replace(/ *\([^)]*\) */g, ' ');

      // Remove brackets and contents inside brackets
      query = query.replace(/ *\[[^)]*\] */g, ' ');

      break;

    default:
      return undefined;
      break;
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
    });
  });
}
