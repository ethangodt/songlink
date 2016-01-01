var regex = require('./regex');

module.exports = {
  makeQuery: makeQuery
};

function makeQuery(song) {
  var query = song.title + ' ' + song.artist;

  query = regex.removePunctuation(query);

  var keywords = [
    ' - Single',
    'feat.',
    'Pt.',
    'Pts.',
    ' - ',
  ];

  query = regex.removeKeywords(query, keywords);

  return query.toLowerCase();
}
