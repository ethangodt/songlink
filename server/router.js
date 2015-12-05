var listenerController = require('./listener/listenerController.js');
// var userController = require('./users/userController');
// var articleController = require('./articles/articleController');
// var categoryController = require('./categories/categoryController');


module.exports = function (router) {

  router.get('/test/:id', listenerController.render);

};



