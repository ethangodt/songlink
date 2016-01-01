module.exports = {
  makeQuery: makeQuery
};

function makeQuery(song) {
  var query = song.title + ' ' + song.artist;
  return query.toLowerCase();
}
