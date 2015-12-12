var utils = require('./providerUtils.js');
var spotify = require('spotify');

module.exports = {
  createQuery: createQuery,
  fetchSongById: fetchSongById,
  fetchSongBySearch: fetchSongBySearch,
  makePrettyObject: makePrettyObject,
  makeUriFromId: makeUriFromId,
  verify: verify
};

function createQuery(songObj) {
  var str = songObj.title + ' ' + songObj.artist;
  var query = str.replace(/[^\w\s]|\bfeat\b|\bft\b|\bprod\b|\s{2,}/gi,' ').replace(/\s+/g, " ");
  console.log(query);
  return query;
};

function fetchSongById(spotifyId, callback) {
  spotify.lookup({ type: 'track', id: spotifyId}, function(err, data) {
    if ( data.error ) {
      // console.log(data);
      callback(new Error('Link is not valid'), null);
    } else {
      callback(null, makePrettyObject(data));
    }
  });
};

function fetchSongBySearch(song, callback) {
  var searchQuery = createQuery(song);
  spotify.search({type: 'track', query: searchQuery}, function(err, data) {
    if ( err ) {
      callback(err, null)
    } else {
      var tracks = data.tracks.items;
      tracks.length ? verify(song, tracks, callback) : passOnWithUndefined(song, callback);
    }
  });
};

function passOnWithUndefined(song, callback) {
  song.spotify_id = undefined;
  console.log('No results from spotify (spotify.js)');
  callback(null, song);
}

function makeUriFromId(spotifyId) {
  return 'spotify:track:' + spotifyId;
};

function makePrettyObject(obj) {
  return {
    title: obj.name,
    artist: obj.artists[0].name,
    album_title: obj.album.name,
    album_art: obj.album.images[0].url,
    album_art_size: 409600,
    spotify_id: obj.id,
    track_length: obj.duration_ms
  };
};

function verify(song, spotifyTracks, callback){
  for (var i=0; i<spotifyTracks.length; i++) {
    var spotifyArtist = utils.convertArtist(spotifyTracks[i].artists[0].name);
    var otherArtist = utils.convertArtist(song.artist);
    var artistsMatch = utils.verifyArtistMatch(spotifyArtist, otherArtist);
    var durationsMatch = utils.verifyMsMatch(spotifyTracks[i].duration_ms, song.track_length);
    console.log(durationsMatch, artistsMatch, spotifyArtist, otherArtist, 'spotify')
    if (durationsMatch && artistsMatch) {
      song.spotify_id = spotifyTracks[i].id;
      return callback(null, song);
    }
  }
  passOnWithUndefined(song, callback);
};

// function verify(song, spotifyTracks, callback) {
//   for (var i = 0; i < spotifyTracks.length; i++) {
//     var spotifyArtist = spotifyTracks[i].artists[0].name.toLowerCase().replace(/[^\w\s\\ ]/gi, '').replace(/[^\D\s\\ ]/gi, '').replace(/\s+/g, "");
//     var otherArtist = song.artist.toLowerCase().replace(/[^\w\s\\ ]/gi, '').replace(/[^\D\s\\ ]/gi, '').replace(/\s+/g, "");
//     var durationsMatch = (Math.abs(song.track_length - spotifyTracks[i].duration_ms) / spotifyTracks[i].duration_ms) < 0.03;
//     var artistsMatch = otherArtist.includes(spotifyArtist);
//     if (durationsMatch && artistsMatch) {
//       song.spotify_id = spotifyTracks[i].id
//       return callback(null, song);  
//     }
//   }
//   callback(new Error('No spotify tracks verified'), null);
// };

