var youtube = require('youtube-node-with-params');

youtube.setKey('AIzaSyB1XCSK0lbdnvCo-tKOfFxjV3LuGk7QOUE');

var params = {
    maxResults: 10,
    kind: "youtube#video"
  }

exports.search = function() {
  youtube.searchWithParams('deadmau5', params, function(resultData) {
      var results = resultData;
      // var ids = results
      console.log(resultData.items[0]);
  });
  // youtube.getById('UCYEK6xds6eo-3tr4xRdflmQ', function(r){
  //   console.log(r)
  // })
}



// var search = require('youtube-search');
 
// var opts = {
//   maxResults: 10,
//   key: 'AIzaSyB1XCSK0lbdnvCo-tKOfFxjV3LuGk7QOUE'
// };

// exports.search = function(){
//   search('deadmau5', {"part": "contentDetails"}, function(err, res) {
//     if(err) return console.log(err);
//     var results = res;
//     console.log(results);
//   })
// };

