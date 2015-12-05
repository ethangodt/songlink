// this function simply takes hash_id and makes a song link string
var makeLinkString = function (hash_id) {
  return 'http://songl.ink/' + hash_id;
};

module.exports = {
  makeLinkString: makeLinkString
};
