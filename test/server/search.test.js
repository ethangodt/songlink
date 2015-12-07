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
        expect(res.body[0]).to.have.all.keys(['title', 'artist', 'album_title', 'album_art', 'itunes_id'])
        done();
      });
  });

  describe('/create endpoint', function () {

    it('should accept a song object with only itunes_id', function (done) {
      request(server)
        .post('/create')
        .send({ itunes_id: '1051400980' })
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.be.a('string');
          expect(res.body).to.have.length(24)
          done();
        });
    });

    it('should accept a song object with only spotify_id', function (done) {
      request(server)
        .post('/create')
        .send({ spotify_id: '0ENSn4fwAbCGeFGVUbXEU3' })
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.be.a('string');
          expect(res.body).to.have.length(24)
          done();
        });
    });

    it('should accept a song object with some song data', function (done) {
      request(server)
        .post('/create')
        .send({
          title: 'Hello',
          artist: 'Adele',
          album_title: '25',
          itunes_id: '1051394215',
          album_art: 'http://is5.mzstatic.com/image/thumb/Music6/v4/8c/91/5d/8c915d9b-d9e4-f735-1b91-81ca1b6e6312/source/100x100bb.jpg'
        })
        .expect(200)
        .end(function (err, res) {
          expect(res.body).to.be.an('string');
          expect(res.body).to.have.length(24)
          done();
        })
    });

  });

  
  it('should 404 everything else', function (done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
