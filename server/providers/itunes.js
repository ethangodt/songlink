var request = require('request');

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
      callback(new Error('Error fetching itunes song by search:', err), null);
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
};

function makeSearchUrlWithString(idString) {
  var baseSearch = 'https://itunes.apple.com/search?term=';
  var entity = '&entity=song';

  return baseSearch + idString + entity;
};

function makeFetchByIdUrl(itunesId) {
  return 'https://itunes.apple.com/lookup?id=' + itunesId;
}

function search(searchUrl, numResults, callback) {
  request(searchUrl, function (err, response, body) {
    body = JSON.parse(body);
    if (err) {
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
          itunes_app_uri: 'itmss' + results[i].trackViewUrl.substring(5),
          track_length: results[i].trackTimeMillis
        });
      }

      callback(err, numResults === 1 ? songs[0] : songs.slice(0, numResults));
    }
  })
}

function verify(song, itunesTracks, callback) {

  for (var i = 0; i < itunesTracks.length; i++) {
    var durationsMatch = (Math.abs(song.track_length - itunesTracks[i].track_length) / itunesTracks[i].track_length) < 0.03;
    var artistMatch = song.artist === itunesTracks[i].artist;

    if (durationsMatch && artistMatch) {
      song.itunes_id = itunesTracks[i].itunes_id;
      song.itunes_app_uri = itunesTracks[i].itunes_app_uri;

      return callback(null, song);  
    }
  }

  passOnWithUndefined(song, callback);
}
