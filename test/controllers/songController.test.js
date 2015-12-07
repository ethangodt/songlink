var expect = require('chai').expect;
var mongoose = require('mongoose');
var Song = require('../../server/models/song');
var controller = require('../../server/controllers/songController');

var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/songlink';

var clearDB = function (done) {
  mongoose.connection.collections['songs'].remove(done);
};

describe('Song controller', function () {

  // Connect to database before any tests
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(mongoUrl, done);
  });

  beforeEach(function (done) {
    clearDB(function () {

      var songs = [
        {
          title: 'Stairway to Heaven',
          album_title: 'Led Zeppelin IV',
          artist: 'Led Zeppelin',
          itunes_id: 'another_itunes_string',
          album_art: 'http://is2.mzstatic.com/image/thumb/Music1/v4/b0/43/4d/b0434dcd-2cef-1a9d-a35d-486b8dbe2f2c/source/100x100bb.jpg',
          album_art_size: 10000
        },
        {
          title: 'Intro',
          album_title: 'This Is All Yours',
          artist: 'Alt-J',
          itunes_id: 'yet_another_itunes_string',
          album_art: 'http://is2.mzstatic.com/image/thumb/Music1/v4/b0/43/4d/b0434dcd-2cef-1a9d-a35d-486b8dbe2f2c/source/100x100bb.jpg',
          album_art_size: 10000
        }
      ];

      Song.create(songs, done);
    });
  });

  // TODO: Write your tests for jobController here
  it('should retrieve single song with title and artist', function (done) {

    var songObj = { title: 'Intro', artist: 'Alt-J' }

    controller.get(songObj, function (err, song) {
      if (err) {
        throw err;
      }
      expect(song).to.be.an('object');
      expect(song.album_title).to.equal('This Is All Yours');
      done();
    });

  });

  it('should create a new song', function (done) {
    
    var newSong = {
      title: 'Cream on Chrome',
      artist: 'Ratatat',
      album_title: 'Magnifique',
      itunes_id: 'and_yet_another_id',
      album_art: 'http://is2.mzstatic.com/image/thumb/Music1/v4/b0/43/4d/b0434dcd-2cef-1a9d-a35d-486b8dbe2f2c/source/100x100bb.jpg',
      album_art_size: 10000
    };

    controller.create(newSong, function (err, song) {
      expect(song).to.deep.equal(song);
      var query = { title: 'Cream on Chrome', artist: 'Ratatat' }
      controller.get(query, function (err, song) {
        if (err) {
          throw err;
        }
        expect(song).to.be.an('object');
        expect(song.album_title).to.equal('Magnifique');
        done();
      });
    });

  });

});
