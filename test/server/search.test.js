var request = require('supertest');

describe('server', function () {
  
  var server;

  before(function () {
    server = require('../../server/server.js');
  });

  
  it('responds to /', function (done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
  
  // it('404 everything else', function (done) {
  //   request(server)
  //     .get('/foo/bar')
  //     .expect(404, done);
  // });
});
