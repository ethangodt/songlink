// todo itunes and youtube api calls working
var requests = {
  itunes: require('../providerModules/itunes'),
  spotify: null, // fill these out with functions
  youtube: null // fill these out with functions
};

var mergeData = function (mainData, newData, provider) {
  // currently, in addition to adding <provider>_id, this function only maximizes the image size of the url, but it could do anything
  // todo consider revising this to not mutate mainData — return a new object

  // add newData's provider id
  mainData[provider + '_id'] = newData[provider + '_id'];

  // choose largest album art dimensions
  if (mainData.album_art_size < newData.album_art_size) {
    mainData.album_art = newData.album_art;
    mainData.album_art_size = newData.album_art_size;
  }
};

var songBuilder = function (songData, callback) {
  // todo consider breaking this list out into a utils object
  var providers = ['itunes'];

  providers.forEach(function (provider, index) {
    if (!songData[provider + '_id']) {
      requests[provider](songData, function(err, newData) {
        mergeData(songData, newData, provider);
        if (index === providers.length - 1) {
          callback(null, songData);
        }
      });
    }
  });
};

module.exports = songBuilder;
