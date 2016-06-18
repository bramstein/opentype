var name = require('../../src/tables/name');
var expect = require('unexpected');
var iconv = require('iconv-lite');
var c = require('concentrate');

describe('tables.name', function () {
  it('parses the name table', function () {
    var buffer = c()
      .uint16be(0)    // format       (0)
      .uint16be(1)    // count        (2)
      .uint16be(18)   // stringOffset (4)
      .uint16be(3)    // platformID   (6)
      .uint16be(1)    // encodingID   (8)
      .uint16be(1033) // languageID   (10)
      .uint16be(1)    // nameID       (12)
      .uint16be(6)    // length       (14)
      .uint16be(0)    // offset       (16)
      .string(iconv.encode('FOO', 'utf16be'));

    expect(name(buffer.result()), 'to equal', {
      'en-US': {
        fontFamily: 'FOO'
      }
    });
  });
});
