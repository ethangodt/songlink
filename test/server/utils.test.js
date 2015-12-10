var expect = require('chai').expect;
var utils = require('../../server/utils/utils')

describe('utils', function () {

  describe('getNumberOfIds function', function () {

    var song;

    beforeEach(function() {
      song = {
        title: 'some title',
        artist: 'some artist',
        album_title: 'some album',
        itunes_id: 'some_itunes_id',
        spotify_id: 'some_spotify_id',
        youtube_id: 'some_youtube_id'
      };
    });

    it('correctly counts num of ids', function () {
      expect(utils.getNumberOfIds(song)).to.equal(3);
      delete song.itunes_id;
      expect(song.hasOwnProperty('itunes_id')).to.equal(false);
      expect(utils.getNumberOfIds(song)).to.equal(2);
    });

    it('correctly counts num of ids with undefined ids', function () { 
      song.spotify_id = undefined;
      expect(song.spotify_id).to.equal(undefined);
      expect(utils.getNumberOfIds(song)).to.equal(3);
    });

  });

  describe('makeSongLinkUrl function', function () {

    it('correctly returns songlink for localhost', function () {
      var link = utils.makeSongLinkUrl('localhost:3000', 'abc123');
      expect(link).to.equal('http://localhost:3000/abc123');
    });

    it('correctly returns songlink for songl.ink', function () {
      var link = utils.makeSongLinkUrl('songl.ink', 'abc123');
      expect(link).to.equal('http://songl.ink/abc123');
    });

  });
  
});
