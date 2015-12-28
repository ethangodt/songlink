var utils = require('../utils/utils');
var path = require('path');
var providers = require('../providers');

module.exports = {
  create: create,
  render: render,
  search: search
};

function create(req, res) {

  utils.checkDb(req.body)
    .then(function(songFromDb) {
      if (songFromDb) {
        return res.send(utils.makeSongLinkObject(songFromDb, req.headers.host));
      } else {
        return utils.verifyId(req.body)
          .then(utils.build)
          .then(utils.createHash)
          .then(utils.addSongToDb)
          .then(function(finalSong) {
            res.send(utils.makeSongLinkObject(finalSong, req.headers.host));
          });
      }
    })
    .catch(function (err) {
      res.status(400).send(err.message);
      console.error(err);
    });

}

function render(req, res) {
    res.sendFile(path.resolve('client/index.html'));
}

function search(req, res) {
  var queryString = providers.itunes.makeSearchUrlWithQuery(req.query.search);
  providers.itunes.search(queryString, 10, function (err, songs) {
    if (err) {
      res.status(400).send(err.message);
    } else {
      res.status(200).send(providers.itunes.makeSearchResultsObjects(songs));
    }
  });
}

