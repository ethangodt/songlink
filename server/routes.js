var appPageHandlers = require('./handlers/appPage');
var linkPageHandlers = require('./handlers/linkPage');
var pruneHandler = require('./handlers/prune');

module.exports = function (app) {
  app.get('/search', appPageHandlers.search);
  
  app.get('/preferences', appPageHandlers.render);

  app.post('/create', appPageHandlers.create);

  app.get('/:id', linkPageHandlers.render);

  app.get('/', appPageHandlers.render);

  app.put('/prune', pruneHandler)
};
