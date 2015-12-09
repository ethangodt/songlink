var request = require('request');

module.exports = {
  fetchSongById: fetchSongById,
  fetchSongBySearch: fetchSongBySearch,
  // makeFetchByIdUrl: makeFetchByIdUrl,
  // makeSearchUrlWithSong: makeSearchUrlWithSong,
  makeSearchUrlWithString: makeSearchUrlWithString,
  search: search
};

function fetchSongById(itunesId, callback) {
  search(makeFetchByIdUrl(itunesId), 1, callback);
}

function fetchSongBySearch(song, callback) {
  search(makeSearchUrlWithSong(song), 10, function (err, songs) {
    if (err) {
      callback(err, null);
    } else {
      // verify this somehow, like stobie did with spt
      song.itunes_id = songs[0].itunes_id;
      song.itunes_app_uri = songs[0].itunes_app_uri;
      callback(null, song);
    }
  });
}

function makeSearchUrlWithSong(song) {
  var baseSearch = 'https://itunes.apple.com/search?term=';
  var entity = '&entity=song';
  var queryString = '';

  for (var key in song) {
    if (key === 'title' || key === 'artist' || key === 'album_title') {
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
