var expect = require('chai').expect;
var mongoose = require('mongoose');
var Song = require('../../server/db/models/song');

describe('Song model', function () {

  it('should be a Mongoose model', function () {
    expect(new Song()).to.be.instanceOf(mongoose.Model);
  });

  it('should have a schema', function () {
    expect(Song.schema).to.exist;
  });

});
