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

  router.get('/:id', listenHandler.render);

  router.post('/test', listenHandler.test); //for adding data for testing
};
