// var echobest = require('echo-best');
var client = (require('ituner')());
var spotify = require('spotify');

// var key = process.env.ECHONEST_KEY;
// var echo = echobest(key);


// exports.echoSearch = function(req, res) {
//   var opts = {
//     combined: req.query.search,
//     results: 10,
//     // sort: 'song_hotttnesss-desc',
//     bucket: 'song_hotttnesss'
//     // rank_type: 'relevance'
//   };
  
//   echo('song/search', opts, function(error, response) {
//     if (error) {
//       console.error(error);
//     } else {
//       console.log(response);
//       res.send(response.songs);
//     }
//   });
// }

exports.appleSearch = function(req, res) {
  // if (text.slice(0,4) === "http") {
  //   if (text.includes("itun.es")) {
  //     var arr = text.split('=');
  //     var itunesID = arr[arr.length - 1];
  //     console.log(spotifyID);
  //   } else if (text.includes("spotify")) {
  //     var arr = text.split('/');
  //     var spotifyID = arr[arr.length - 1];
  //     spotify.lookup({ type: 'track', id: spotifyID}, function(err, data) {
  //         if ( err ) {
  //             console.log('Error occurred: ' + err);
  //             return;
  //         }
  //         console.log(data);      
  //     });
  //   }
  // } else if (text.slice(0,8) === "spotify:") {
  //   var arr = text.split(':');
  //   var spotifyID = arr[arr.length - 1];
  //   console.log(spotifyID)
  // } else {
  var text = req.query.search;
  client.search(text, function (err, results) {
    if (err) {
      console.error(err);
    }
   res.status(200).send(results)
  });
}
