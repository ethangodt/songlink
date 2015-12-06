// var echobest = require('echo-best');
var itunes = (require('ituner')());

exports.appleSearch = function(req, res) {
  var text = req.query.search;
  itunes.search(text, function (err, result) {
    if (err) {
      console.error(err);
    }
    var arr = result.results;
    var songs = [];
    for (var i=0; i<arr.length; i++) {
      songs.push({
        name: arr[i].trackName,
        album_name: arr[i].collectionName,
        artist: arr[i].artistName,
        itunes_id: arr[i].trackId,
        album_art: arr[i].artworkUrl100,
        album_art_size: 1000
      })
    }
    console.log(songs);
    res.status(200).send(songs)
  });
}