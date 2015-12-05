var listenHandler = require('./listenHandler.js')

module.exports = function (router) {

  router.get('/test/:id', listenHandler.render);// test2/:id should be changed to :id, where id is the req.param that identifies the song id in the database
  router.post('/test', listenHandler.test); //for adding data for testing
};
