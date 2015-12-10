var expect = require('chai').expect;
var request = require('supertest');

xdescribe('server', function () {
  
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
          'itunes_id',
          'itunes_app_uri'
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

    it('should accept a song object with only itunes_id', function (done) {
      request(server)
        .post('/create')
        .send({ itunes_id: '373317369' })
        .expect(200)
        .end(function (err, res) {
          expect(res.text).to.be.a('string');
          done();
        });
    });

    it('should accept a song object with only spotify_id', function (done) {
      request(server)
        .post('/create')
        .send({ spotify_id: '0ENSn4fwAbCGeFGVUbXEU3' })
        .expect(200)
        .end(function (err, res) {
          expect(res.text).to.be.a('string');
          done();
        });
    });

    it('should accept a song object with some song data', function (done) {
      request(server)
        .post('/create')
        .send({
          title: 'Animals',
          album_title: 'V (Deluxe)',
          artist: 'Maroon 5',
          itunes_id: 993352741,
          album_art: 'http://is5.mzstatic.com/image/thumb/Music7/v4/b3/fb/cc/b3fbcca9-85a0-c25d-cb20-feee4900bdb2/source/100x100bb.jpg',
          album_art_size: 1000,
          track_length: 231079,
          itunes_app_uri: 'itmss://itunes.apple.com/us/album/animals/id993352739?i=993352741&uo=4'
        })
        .expect(200)
        .end(function (err, res) {
          expect(res.text).to.be.an('string');
          done();
        });
    });

  });

});
