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
      res.send(utils.makeSongLinkUrl(req.headers.host, songFromDb.hash_id));
    } else {
      if (!song.title) {
        utils.verifyId(song, function (err, songFromVerification) {
          if (err) {
            console.error(err);
            res.status(400).send("Link is not valid");
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
                      res.send(utils.makeSongLinkUrl(req.headers.host, songFromDb.hash_id));
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
                  res.send(utils.makeSongLinkUrl(req.headers.host, songFromDb.hash_id));
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
      console.error(err);
    } else {
      res.status(200).send(songs)
    }
  });
}

