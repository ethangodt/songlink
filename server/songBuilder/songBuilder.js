var utils = require('../utils');

var mergeData = function (mainData, newData, provider) {
  // currently, in addition to adding <provider>_id, this function only maximizes the image size of the url, but it could do anything
  // todo consider revising this to not mutate mainData — return a new object

  // add newData's provider id
  mainData[provider + '_id'] = newData[provider + '_id'];

  // choose largest album art
  if (mainData.album_art_size < newData.album_art_size) {
    mainData.album_art = newData.album_art;
    mainData.album_art_size = newData.album_art_size;
  }
};

var getNumberOfIds = function (songData) {
  // just gets the number of ids to determine the number of providers this song currently supports
  var keys = Object.keys(songData);
  var keyExpression = /(\w+(_id))/i;
  var ids = keys.filter(function (key) {
    return keyExpression.test(key);
  });
  return ids.length;
};

var songBuilder = function (songData, callback) {
  var providers = Object.keys(utils.providers);
  providers.forEach(function (provider) {
    if (!songData[provider + '_id']) { // if no id for this provider
      utils.providers[provider].getData(songData, function(err, newData) {
        mergeData(songData, newData, provider);
        if (getNumberOfIds(songData) === providers.length) { // after async process, if songObject has all providers invoke callback
          callback(null, songData);
        }
      });
    }
  });
};

module.exports = songBuilder;
