var expect = require('chai').expect;
var request = require('supertest');

describe('server', function () {
  
  var server;

  before(function () {
    server = require('../../server/server.js');
  });

  it('responds with 200 to /', function (done) {
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('responds to /search with search results', function (done) {
    request(server)
      .get('/search')
      .query({ search: 'hello' })
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.all.keys([
          'title',
          'artist',
          'album_title',
          'album_art',
          'album_art_size',
          'track_length',
          'itunes_id'
        ])
        done();
      });
  });

  it('should 404 everything else', function (done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });

  describe('/create endpoint', function () {

    xit('should accept a song object with only itunes_id', function (done) {
      request(server)
        .post('/create')
        .send({ itunes_id: '1051876266' })
        .expect(200)
        .end(function (err, res) {
          expect(res.text).to.be.a('string');
          expect(res.text).to.have.length(22);
          done();
        });
    });

    xit('should accept a song object with only spotify_id', function (done) {
      request(server)
        .post('/create')
        .send({ spotify_id: '0ENSn4fwAbCGeFGVUbXEU3' })
        .expect(200)
        .end(function (err, res) {
          expect(res.text).to.be.a('string');
          expect(res.text).to.have.length(22);
          done();
        });
    });

    it('should accept a song object with some song data', function (done) {
      request(server)
        .post('/create')
        .send({
          title: 'Tessellate',
          artist: 'alt-J',
          album_title: 'An Awesome Wave',
          itunes_id: '1051394215',
          album_art: 'http://is2.mzstatic.com/image/thumb/Music/v4/3b/43/9e/3b439e7f-9989-1dc1-9ffb-8d876ddb0da1/source/100x100bb.jpg'
        })
        .expect(200)
        .end(function (err, res) {
          expect(res.text).to.be.an('string');
          expect(res.text).to.have.length(22);
          done();
        });
    });

  });

});
