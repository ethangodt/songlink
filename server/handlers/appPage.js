var utils = require('../utils/utils');
var path = require('path');
var providers = require('../providers');

module.exports = {
  create: create,
  render: render,
  search: search
};

function create(req, res) {
  utils.checkDb({source_id: req.body.source_id})
    .then(function(songFromDb) {
      if (songFromDb) {
        return res.send(utils.makeSongLinkObject(songFromDb));
      } else {
        return utils.verifyId(req.body)
          .then(utils.build)
          .then(function(song) {
            var str = song.title + song.artist + song.album_title;
            return utils.createUniqueHash(str)
              .then(function(hash_id) {
                song.hash_id = hash_id;
                return song;
              })
              .then(utils.addSongToDb)
              .then(function(finalSong) {
                res.send(utils.makeSongLinkObject(finalSong, req.headers.host));
              });
          })
      }
    })
    .catch(function(err) {
      res.status(400).send(err.message);
      console.error(err);
    });
}

function render(req, res) {
    res.sendFile(path.resolve('client/index.html'));
}

function search(req, res) {
  var queryString = providers.itunes.makeSearchUrlWithQuery(req.query.search);
  providers.itunes.search(queryString, 6, function (err, songs) {
    if (err) {
      res.status(400).send(err.message);
    } else {
      res.status(200).send(providers.itunes.makeSearchResultsObjects(songs));
    }
  });
}
