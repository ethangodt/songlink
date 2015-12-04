var Song = require('../models/song');

var get = function (songObj, callback) {
  // allows you to search with misc. song criteria
  Song.find(songObj, function (err, response) {
    if (err) {
      console.error(err);
    }
    callback(err, response);
  })
};

var create = function (songData, callback) {
  Song.create(songData, function (err, response) {
    if (err) {
      console.error(err);
    }
    callback(err, response);
  })
};

module.exports = {
  get: get,
  create: create
};
