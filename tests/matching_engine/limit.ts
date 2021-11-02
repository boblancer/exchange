import Limit from "../../src/matching_engine/limit";
var assert = require('assert');

describe('Limit', function() {
  var initialShare = 500
  var initialLimit = 20

  describe('Arithmatic Operation', function() {

    it('should correctly perform placeShareOrder(Add) operation', function() {
      let lim = new Limit(initialShare, initialLimit)
      lim.placeShareOrder(200)

      let expected = initialShare + 200
      assert.equal(lim.availableShare(), expected);
    });

    it('should correctly perform removeShare(Subtract) operation', function() {
      let lim = new Limit(initialShare, initialLimit)
      lim.removeShare(200)

      let expected = initialShare - 200
      assert.equal(lim.availableShare(), expected);
    });
  });

  describe('Getters', function() {
    it('#limitPrice() should correctly retrieve limit price', function() {
      let lim = new Limit(initialShare, initialLimit)

      let expected = initialLimit
      assert.equal(lim.limitPrice(), expected);
    });

    it('#availableShare() should correctly retrieve available shares', function() {
      let lim = new Limit(initialShare, initialLimit)

      let expected = initialShare
      assert.equal(lim.availableShare(), expected);
    });
  });

});