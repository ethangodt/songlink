var listenHandler = require('./listenHandler.js')

var plainText = require('../requests/plainTextSearch.js');
var path = require('path');
var createHandler = require('./createHandler');




module.exports = function (router) {

  router.get('/search', plainText.appleSearch);
  
  router.get('/preferences', function(req, res) {
    res.sendFile(path.resolve('client/index.html'));
  });

  router.get('/preferences', function(req, res) {
    res.sendFile(path.resolve('client/index.html'));
  });

  router.post('/create', createHandler);

  router.get('/', function(req, res) {
    res.sendFile(path.resolve('client/index.html'));
  });

  router.get('/test/:id', listenHandler.render);// test2/:id should be changed to :id, where id is the req.param that identifies the song id in the database
  router.post('/test', listenHandler.test); //for adding data for testing
};
