var expect = require('chai').expect;
var providerUtils = require('../../server/providers/providerUtils.js');

xdescribe('providerUtils module', function () {

  describe('convertArtist function', function () {

    var queryString;

    beforeEach(function () {
      queryString = "What the HECK !@#{$%^&} - Alt-J";
    });

    it('removes special characters and converts a string to lower case', function () {
      expect(providerUtils.convertArtist(queryString))
        .to.equal('what the heck alt j');
    });

  });

  describe('verifyArtistMatch function', function () {

    var artist1;
    var artist2;

    beforeEach(function () {
      artist1 = providerUtils.convertArtist("Nick and the Beeboops");
      artist2 = providerUtils.convertArtist("Nick AND the BEEBOOPS Crew");
    });

    it("returns true when two artists are a match", function () {
      expect(providerUtils.verifyArtistMatch(artist1, artist2))
        .to.equal(true);
    });

    it("returns false if the artists are different", function () {
      var artist2 = "Nick and His Friends Who Sing"
      expect(providerUtils.verifyArtistMatch(artist1, artist2))
        .to.equal(false);
    });

  });

  describe('verifyMsMatch function', function () {

    var artist1Ms;
    var artist2Ms;

    beforeEach(function () {
      artist1Ms = 150000;
      artist2Ms = 146000;
    });

    it("returns true when song lengths are within 3% of each other", function () {
      expect(providerUtils.verifyMsMatch(artist1Ms, artist2Ms))
        .to.equal(true);
    });

    it("returns false when song lengths differentiate by more than 3%", function () {
      var artist2Ms = 145000
      expect(providerUtils.verifyMsMatch(artist1Ms, artist2Ms))
        .to.equal(false);
    });

  });

});
