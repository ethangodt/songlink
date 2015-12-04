// this module handles post requests to the /create endpoint
var verifyLink = require('./verifyLink');
var songCtrl = require('./songController');

module.exports = function (req, res) {
  // depending on the specific case, clientData could be an object with some song data, or it could be a raw provider url/uri

  if (typeof req.body === 'string') {
    // convert req.body url/uri into object like would be retrieved from redis
    // todo call Stobie's function which will identify the link type and return an object with track id
    var songData = {
      spotify: '4QhWbupniDd44EDtnh2bFJ'
    }
  } else {
    // get the song data from redis or something
  }

  verifyLink(songData)

    // check existence in db
    .then(function () {
      return songCtrl.get();
    }, function (invalidMessage) {
      res.send(invalidMessage);
    })

    // build song data
    .then(function () {
      // if there is nothing in the db
    }, function (premadeUniversalLink) {
      // if there is something in the db
      res.send(premadeUniversalLink);
    })

    // return song link
    .then(function (newUniversalLink) {
      res.send(newUniversalLink);
    })
};
