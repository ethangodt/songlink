var expect = require('chai').expect;
var spotify = require('../../server/providers/spotify')
var songs = require('../../mocks/songlink_songs/source_itunes/songs.json')

describe('spotify module', function () {

  describe('makeLink function', function () {

    it('should create a spotify uri given a song object', function () {
      expect(spotify.makeLink(songs[0]))
        .to.equal('spotify:track:126TblwXGNTUZ7RPMnThkU');
    });

  });

  xdescribe('createQuery function', function () {
    // feat, ft, prod, symbols to spaces
    var song;

    beforeEach(function () {
      song = {
        title: 'title of song',
        artist: 'some artist',
        album_title: 'some title of an album'
      }
    });

    it('creates a query string from song object', function () {

      var title = song.title;

      song.artist = 'Alt-J';
      expect(spotify.createQuery(song)).to.equal(title + '+Alt-J');
      song.artist = 'Alt-J feat. $tobie';
      expect(spotify.createQuery(song)).to.equal(title + '+Alt-J feat. $tobie');
      song.artist = 'Alt-J featuring $tobie [prod. by Producer Kurt]';
      expect(spotify.createQuery(song)).to.equal(title + '+Alt-J featuring $tobie [prod. by Producer Kurt]');

    });

  });

  xdescribe('makePrettyObject function', function () {

    var input = {
      name: 'title',
      artists: [{name: 'artist name'}],
      album: {name: 'album title', images:
      [ { height: 640,
          url: 'large image',
          width: 640 },
        { height: 300,
          url: 'medium image',
          width: 300 },
        { height: 64,
          url: 'small image',
          width: 64 } ] },
      id: 0,
      duration_ms: 1000,

    };

    it('creates a song object from soptify data', function () {
      expect(spotify.makePrettyObject(input))
        .to.deep.equal({
          title: 'title',
          artist: 'artist name',
          album_title: 'album title',
          album_art: 'large image',
          album_art_size: 409600,
          spotify_id: 0,
          track_length: 1000,
          spotify_images: {
            large_image: {
              height: 640,
              url: 'large image',
              width: 640 },
            medium_image: {
              height: 300,
              url: 'medium image',
              width: 300 },
            small_image: {
              height: 64,
              url: 'small image',
              width: 64 }
          }
        });
    });
  });

  xdescribe('verify function', function () {

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

    it('verifies song with artist (partial match: song has more info)', function (done) {

      song.artist = 'kurt feat. timbaland';
      itunesTracks[1].artist = 'stobie';

      itunes.verify(song, itunesTracks, function(err, verifiedSong) {
        expect(verifiedSong.itunes_id).to.equal(1);
        done();
      });

    });

    it('verifies song with artist (partial match: result has more info)', function (done) {

      itunesTracks[0].artist = 'kurt feat. timbaland';
      itunesTracks[1].artist = 'stobie';

      itunes.verify(song, itunesTracks, function(err, verifiedSong) {
        expect(verifiedSong.itunes_id).to.equal(1);
        done();
      });

    });

  });

});
