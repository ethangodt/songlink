var utils = require('../utils/utils');
var path = require('path');
var providers = require('../providers');

module.exports = {
  create: create,
  render: render,
  search: search
};

function create(req, res) {

  var song = req.body;

  utils.checkDb(song, function (err, songFromDb) {
    if (songFromDb) {
      var obj = {};
      obj.share_link = utils.makeSongLinkUrl(req.headers.host, songFromDb.hash_id);
      obj.artist = songFromDb.artist;
      obj.title = songFromDb.title;
      obj.album_title = songFromDb.album_title;
      obj.album_art = songFromDb.album_art;
      res.send(obj);
    } else {
      if (!song.title) {
        utils.verifyId(song, function (err, songFromVerification) {
          if (err) {
            res.status(400).send(err.message);
          } else {
            utils.build(songFromVerification, function (err, songFromBuild) {
              if (err) {
                console.error(err);
              } else {
                utils.createHash(songFromBuild, 0, function(songFromHasher) {
                  utils.addSongToDb(songFromHasher, function (err, songFromDb) {
                    if (err) {
                      console.error(err)
                    } else {
                      var obj = {};
                      obj.share_link = utils.makeSongLinkUrl(req.headers.host, songFromDb.hash_id);
                      obj.artist = songFromDb.artist;
                      obj.title = songFromDb.title;
                      obj.album_title = songFromDb.album_title;
                      obj.album_art = songFromDb.album_art;
                      res.send(obj);
                    }
                  });
                });
              }
            });
          }
        });
      } else {
        utils.build(song, function (err, songFromBuild) {
          if (err) {
            console.error(err);
          } else {
            utils.createHash(songFromBuild, 0, function(songFromHasher) {
              utils.addSongToDb(songFromHasher, function (err, songFromDb) {
                if (err) {
                  console.error(err)
                } else {
                  var obj = {};
                  var url = req.headers.host;
                  if (req.headers.host.slice(0,4) === "www.") {
                    url = req.headers.host.slice(4);
                  }
                  obj.share_link = utils.makeSongLinkUrl(url, songFromDb.hash_id);
                  obj.artist = songFromDb.artist;
                  obj.title = songFromDb.title;
                  obj.album_title = songFromDb.album_title;
                  obj.album_art = songFromDb.album_art;
                  res.send(obj);
                }
              });
            });
          }
        });
      }
    }
  });

}

function render(req, res) {
    res.sendFile(path.resolve('client/index.html'));
}

function search(req, res) {
  var queryString = providers.itunes.makeSearchUrlWithString(req.query.search);
  providers.itunes.search(queryString, 10, function (err, songs) {
    if (err) {
      res.status(400).send(err.message);
    } else {
      res.status(200).send(songs)
    }
  });
}

