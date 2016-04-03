var expect = require('chai').expect;
var mongoose = require('mongoose');
var Song = require('../../server/db/models/song');
var controller = require('../../server/db/controllers/songController');

var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/songlink';

var clearDB = function(done) {
  mongoose.connection.collections['songs'].remove(done);
};

describe('Song controller', function () {

  before(function(done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(mongoUrl, done);
  });

  after(function(done) {
    mongoose.connection.close(done);
  });

  beforeEach(function(done) {
    clearDB(function () {
			var itunesSongs = require('../../mocks/songlink_songs/source_itunes/songs.json');
			var spotifySongs = require('../../mocks/songlink_songs/source_spotify/songs.json');
			var songs = itunesSongs.concat(spotifySongs);
      Song.create(songs, done);
    });
  });

  it('should retrieve single song with hash_id', function (done) {
    var query = { hash_id: 'd3bcd' };

    controller.get(query, function (err, song) {
      if (err) {
        throw err;
      }
      expect(song).to.be.an('object');
      expect(song.source_id).to.equal('887763877');
      done();
    });
  });

	it('should retrieve single song with source_id from itunes', function (done) {
    var query = { source_id: '335804209' };

    controller.get(query, function (err, song) {
      if (err) {
        throw err;
      }
      expect(song).to.be.an('object');
      expect(song.hash_id).to.equal('203dd');
      done();
    });
  });

	it('should retrieve single song with source_id from spotify', function (done) {
    var query = { source_id: '1ySdjlU5Vc24w81xam2MHR' };

    controller.get(query, function (err, song) {
      if (err) {
        throw err;
      }
      expect(song).to.be.an('object');
      expect(song.hash_id).to.equal('8c2c9');
      done();
    });
  });

  it('should save a new song to the db', function (done) {
    var newSong = require('../../mocks/songlink_songs/source_itunes/song.json');

    controller.create(newSong, function (err, song) {
      var query = { hash_id: 'f6346' }
      controller.get(query, function (err, song) {
        if (err) {
          throw err;
        }
        expect(song).to.be.an('object');
        expect(song.source_id).to.equal('159476284');
        done();
      });
    });
  });
});
