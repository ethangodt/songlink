var youtube = require('youtube-node-with-params');

youtube.setKey('AIzaSyB1XCSK0lbdnvCo-tKOfFxjV3LuGk7QOUE');

var params = {
    maxResults: 10,
    kind: "youtube#video",
    id: {
      kind: "youtube#video"
    }
  };

exports.search = function() {
  var ids = [];
  youtube.searchWithParams('deadmau5 the veldt', params, function(resultData) {
      var results = resultData;
      for (var i = 0; i < resultData.items.length; i++){
        ids.push(resultData.items[i].id.videoId)
      };
      console.log(ids);
  });
  var par = {
    id: ids
  }
  youtube.getById(par, function(r){
    console.log(r)
  })
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

