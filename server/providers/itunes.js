var request = require('request');
var utils = require('./providerUtils.js');

module.exports = {
  fetchSongById: fetchSongById,
  fetchSongBySearch: fetchSongBySearch,
  makeFetchByIdUrl: makeFetchByIdUrl,
  makeSearchUrlWithSong: makeSearchUrlWithSong,
  makeSearchUrlWithString: makeSearchUrlWithString,
  search: search,
  verify: verify
};

function fetchSongById(itunesId, callback) {
  search(makeFetchByIdUrl(itunesId), 1, callback);
}

function fetchSongBySearch(song, callback) {
  search(makeSearchUrlWithSong(song), 50, function (err, songs) {
    if (err) {
      passOnWithUndefined(song, callback);
      callback(new Error('iTunes search returned no results'), null);
    } else {
      songs.length ? verify(song, songs, callback) : passOnWithUndefined(song, callback);
    }
  });
}

function passOnWithUndefined(song, callback) {
  song.itunes_id = undefined;
  console.log('No results from itunes (itunes.js)');
  callback(new Error('No itunes tracks verified'), song);
}

function makeAppUri(trackViewUrl) {
  var arrAppUri = trackViewUrl.split('');
  arrAppUri.splice(8, 0, 'geo.');
  arrAppUri.splice(-4, 4, 'mt=1&app=music');
  return arrAppUri.join('');
}

function makeSearchUrlWithSong(song) {
  var baseSearch = 'https://itunes.apple.com/search?term=';
  var entity = '&entity=song';
  var queryString = '';

  for (var key in song) {
    if (key === 'title' || key === 'artist') { // || key === 'album_title'
      queryString += song[key].split(' ').join('+');
      queryString += '+';
    }
  }

  // this removes extraneous '+'
  queryString = queryString.substring(0, queryString.length - 1);

  return baseSearch + queryString + entity;
}

function makeSearchUrlWithString(idString) {
  var baseSearch = 'https://itunes.apple.com/search?term=';
  var entity = '&entity=song';

  return baseSearch + idString + entity;
}

function makeFetchByIdUrl(itunesId) {
  return 'https://itunes.apple.com/lookup?id=' + itunesId;
}

function search(searchUrl, numResults, callback) {
  request(searchUrl, function (err, response, body) {
    body = JSON.parse(body);
    if (body.results.length === 0) {
      callback(new Error("Search returned no results"), null)
    } else if (err) {
      callback(err, null);
    } else {
      var songs = [];
      var results = body.results;
      for (var i = 0; i < results.length; i++) {
        songs.push({
          title: results[i].trackName,
          artist: results[i].artistName,
          album_title: results[i].collectionName,
          album_art: results[i].artworkUrl100,
          album_art_size: 1000,
          itunes_id: results[i].trackId,
          itunes_app_uri: (results[i].isStreamable) ? makeAppUri(results[i].trackViewUrl) : null, // sets the app uri if streamable
          itunes_store_uri: (!results[i].isStreamable) ? results[i].trackViewUrl : null, // sets the app uri if not streamable,
          track_length: results[i].trackTimeMillis
        });
      }
      callback(err, numResults === 1 ? songs[0] : songs.slice(0, numResults));
    }
  })
}

function verify(song, formattedResults, callback){
  for (var i=0; i<formattedResults.length; i++) {
    var itunesArtist = utils.convertArtist(formattedResults[i].artist);
    var songArtist = utils.convertArtist(song.artist);
    var artistsMatch = utils.verifyArtistMatch(itunesArtist, songArtist);
    var durationsMatch = utils.verifyMsMatch(formattedResults[i].track_length, song.track_length);
    if (durationsMatch && artistsMatch) {
      song.itunes_id = formattedResults[i].itunes_id;
      song.itunes_app_uri = formattedResults[i].itunes_app_uri || null;
      song.itunes_store_uri = formattedResults[i].itunes_store_uri || null;
      return callback(null, song);
    }
  }
  passOnWithUndefined(song, callback);
}
