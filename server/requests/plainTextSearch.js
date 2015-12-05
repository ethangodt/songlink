// var echobest = require('echo-best');
var client = (require('ituner')());

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
  
  client.search(req.query.search, function (err, results) {
    if (err) {
      console.error(err);
    }
   res.send(results)
  });
}
