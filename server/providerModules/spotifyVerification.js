var spotify = require('spotify');

module.exports = function(itunes, spotify, callback, err) {

  var data = spotify.tracks.items;

  if (data.length === 0) {
    var err = new Error('No results');
    callback(err);
  };

  for (var i=0; i<data.length; i++) {
    var spotify_ms = data[i].duration_ms;
    var durationsMatch = itunes.track_length / spotify_ms > .97 && itunes.track_length / spotify_ms < 1.03;
    var artistsMatch = itunes.artist.includes(data[i].artists[0].name);
    if (durationsMatch && artistsMatch) {
      if (itunes.artist.includes(data[i].artists[0].name)){
        return callback(err, data[i]);  
      }
    }
  }
}