var Song = require('../models/song');

module.exports = {
  create: create,
  get: get
}

function create(songData, callback) {
  Song.create(songData, function (err, response) {
    if (err) {
      console.error(err);
    }
    callback(err, response);
  })
}

function get(songObj, callback) {
  // allows you to search with misc. song criteria
  Song.findOne(songObj, function (err, response) {
    if (err) {
      console.error(err);
    }
    callback(err, response);
  })
}
