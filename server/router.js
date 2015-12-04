var listenerController = require('./listener/listenerController.js');
// var userController = require('./users/userController');
// var articleController = require('./articles/articleController');
// var categoryController = require('./categories/categoryController');


module.exports = function (router) {

  router.get('/test1', listenerController.render);
  router.get('/test2', listenerController.render);
  router.get('/test3', listenerController.render);
  router.get('/test4', listenerController.render2);

};



