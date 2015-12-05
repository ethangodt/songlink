// determine which data we already have and make async calls to other provider modules
var itunes = require('../providerModules/itunes');

// todo initially assume that you have spotify link and need to get iTunes information

// get spotify, itunes and youtube api calls working

module.exports = function (songData, callback) {

  // determine what content we have from songData
  itunes(songData);

  callback(null, completeSongData)
};
