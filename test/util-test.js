var util = require('../src/util');
var Type = require('../src/type');
var expect = require('unexpected');

describe('util', function () {
  describe('extend', function () {
    it('extends an object', function () {
      expect(util.extend({}, { hello: 'world' }), 'to equal', {
        hello: 'world'
      });
    });

    it('overwrites existing properties', function () {
      expect(util.extend({ hello: 'world' }, { hello: 'moon' }), 'to equal', {
        hello: 'moon'
      });
    });

    it('extends multiple objects', function () {
      expect(util.extend({ hello: 'world' }, { foo: 'bar' }, { baz: 'ble' }), 'to equal', {
        hello: 'world',
        baz: 'ble',
        foo: 'bar'
      });
    });
  });

  describe('pad', function () {
    it('pads with the default block size', function () {
      expect(util.pad(9), 'to equal', 12);
      expect(util.pad(8), 'to equal', 8);
    });

    it('pads with a custom block size', function () {
      expect(util.pad(12, 10), 'to equal', 20);
    });
  });

  describe('struct', function () {
    it('creates a new struct', function () {
      var s = util.struct({
        first: Type.BYTE,
        second: Type.BYTE
      });

      expect(s.sizeof, 'to equal', 2);
      expect(s.read, 'to be a function');
    });

    it('creates a new struct with mixed types', function () {
      var s = util.struct({
        first: Type.BYTE,
        second: Type.LONG,
        third: Type.SHORT
      });

      expect(s.sizeof, 'to equal', 7);
      expect(s.read, 'to be a function');
    });

    it('creates a new struct containing a sub-struct', function () {
      var s = util.struct({
        first: Type.BYTE,
        second: util.struct({
          first: Type.LONG
        })
      });

      expect(s.sizeof, 'to equal', 5);
      expect(s.read, 'to be a function');
    });
  });
});
