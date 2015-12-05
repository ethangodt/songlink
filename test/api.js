var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../server/server.js');

// Adds support for assertions on array elements
// https://github.com/chaijs/Chai-Things#examples
// chai.use(require('chai-things'));

describe('RESTful API', function () {

  describe('/', function () {

    describe('GET', function () {

      it('responds with a 200 (OK)', function (done) {

        request(app)
          .get('/test')
          .expect(200, done);

      });

    });

  });

});
