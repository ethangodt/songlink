var expect = require('chai').expect;
var itunes = require('../../server/providers/itunes')

describe('itunes module', function () {

  describe('makeSearchUrlWithSong function', function () {

    var song = {
      title: 'some title',
      artist: 'some artist',
      album_title: 'some album',
      spotify_id: 'some_spotify_id'
    };

    it('creates an itunes search url', function () {
      expect(itunes.makeSearchUrlWithSong(song))
        .to.equal('https://itunes.apple.com/search?term=some+title+some+artist&entity=song');
    });

  });

  describe('makeSearchUrlWithString function', function () {

    var string = 'this is a search string';

    it('creates an itunes search url', function () {
      expect(itunes.makeSearchUrlWithString(string))
        .to.equal('https://itunes.apple.com/search?term=this is a search string&entity=song');
    });

  });

  describe('makeFetchByIdUrl function', function () {

    var id = 'some_itunes_id';

    it('creates an itunes fetch by id url', function () {
      expect(itunes.makeFetchByIdUrl(id))
        .to.equal('https://itunes.apple.com/lookup?id=some_itunes_id');
    });

  });

  describe('verify function', function () {

    var song;
    var itunesTracks;

    beforeEach(function () {
      song = {
        title: 'first track',
        artist: 'kurt',
        track_length: 4010
      };

      itunesTracks = [
        {
          title: 'first track',
          artist: 'kurt',
          track_length: 4000,
          itunes_id: 1
        },
        {
          title: 'first track',
          artist: 'kurt',
          track_length: 4000,
          itunes_id: 2
        }
      ];
    });

    it('verifies song based on duration', function (done) {

      itunesTracks[0].track_length = 2000;

      itunes.verify(song, itunesTracks, function(err, verifiedSong) {
        expect(verifiedSong.itunes_id).to.equal(2);
        done();
      });
    });

    it('verifies song with artist (exact match)', function (done) {

      itunesTracks[1].artist = 'stobie';

      itunes.verify(song, itunesTracks, function(err, verifiedSong) {
        expect(verifiedSong.itunes_id).to.equal(1);
        done();
      });
    });

    xit('verifies song with artist (partial match: song has more info)', function () {
      
      song.artist = 'kurt feat. timbaland';
      itunesTracks[1].artist = 'stobie';
      
      itunes.verify(song, itunesTracks, function(err, verifiedSong) {
        expect(verifiedSong.itunes_id).to.equal(1);
        done();
      });

    });

    xit('verifies song with artist (partial match: result has more info)', function () {

      itunesTracks[0].artist = 'kurt feat. timbaland';
      itunesTracks[1].artist = 'stobie';

      itunes.verify(song, itunesTracks, function(err, verifiedSong) {
        expect(verifiedSong.itunes_id).to.equal(1);
        done();
      });

    });

  });
  
});
