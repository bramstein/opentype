var post = require('../../src/tables/post');
var expect = require('unexpected');
var c = require('concentrate');

describe('tables.post', function () {
  it('reads the post table (version 1.0)', function () {
    var data = c()
      .uint32be(0x00010000) // version
      .uint32be(0x00010000) // italicAngle
      .int16be(10)          // underlinePosition
      .int16be(4)           // underlineThickness
      .uint32be(1)          // isFixedPitch
      .uint32be(10)          // minMemType42
      .uint32be(20)          // maxMemType42
      .uint32be(30)          // minMemType1
      .uint32be(40)          // maxMemType1
      .result();

    expect(post(data), 'to satisfy', {
      version: 0x00010000,
      italicAngle: 0x00010000,
      underlinePosition: 10,
      underlineThickness: 4,
      isFixedPitch: 1,
      minMemType42: 10,
      maxMemType42: 20,
      minMemType1: 30,
      maxMemType1: 40
    });
  });

  it('reads the post table (version 2.0)', function () {
    var data = c()
      .uint32be(0x00020000) // version
      .uint32be(0x00010000) // italicAngle
      .int16be(10)          // underlinePosition
      .int16be(4)           // underlineThickness
      .uint32be(1)          // isFixedPitch
      .uint32be(10)          // minMemType42
      .uint32be(20)          // maxMemType42
      .uint32be(30)          // minMemType1
      .uint32be(40)          // maxMemType1
      .uint16be(4)           // numGlyphs
      .uint16be(0)           // glyphNameIndex[0]
      .uint16be(10)          // glyphNameIndex[1]
      .uint16be(11)          // glyphNameIndex[2]
      .uint16be(12)          // glyphNameIndex[3]
      .result();

    expect(post(data), 'to equal', {
      version: 0x00020000,
      italicAngle: 0x00010000,
      underlinePosition: 10,
      underlineThickness: 4,
      isFixedPitch: 1,
      minMemType42: 10,
      maxMemType42: 20,
      minMemType1: 30,
      maxMemType1: 40,
      glyphNames: {
        0: '.notdef',
        1: 'quotesingle',
        2: 'parenleft',
        3: 'parenright'
      }
    });
  });

  it('reads the post table (version 2.0) with custom strings', function () {
    var data = c()
      .uint32be(0x00020000) // version
      .uint32be(0x00010000) // italicAngle
      .int16be(10)          // underlinePosition
      .int16be(4)           // underlineThickness
      .uint32be(1)          // isFixedPitch
      .uint32be(10)          // minMemType42
      .uint32be(20)          // maxMemType42
      .uint32be(30)          // minMemType1
      .uint32be(40)          // maxMemType1
      .uint16be(2)           // numGlyphs
      .uint16be(258)           // glyphNameIndex[0]
      .uint16be(259)           // glyphNameIndex[0]
      .uint8(3).string("FOO")
      .uint8(3).string("BAR")
      .result();

    expect(post(data), 'to equal', {
      version: 0x00020000,
      italicAngle: 0x00010000,
      underlinePosition: 10,
      underlineThickness: 4,
      isFixedPitch: 1,
      minMemType42: 10,
      maxMemType42: 20,
      minMemType1: 30,
      maxMemType1: 40,
      glyphNames: {
        0: 'FOO',
        1: 'BAR'
      }
    });
  });

  it('reads the post table (version 3.0)', function () {
    var data = c()
      .uint32be(0x00030000) // version
      .uint32be(0x00010000) // italicAngle
      .int16be(10)          // underlinePosition
      .int16be(4)           // underlineThickness
      .uint32be(1)          // isFixedPitch
      .uint32be(10)          // minMemType42
      .uint32be(20)          // maxMemType42
      .uint32be(30)          // minMemType1
      .uint32be(40)          // maxMemType1
      .result();

    expect(post(data), 'to equal', {
      version: 0x00030000,
      italicAngle: 0x00010000,
      underlinePosition: 10,
      underlineThickness: 4,
      isFixedPitch: 1,
      minMemType42: 10,
      maxMemType42: 20,
      minMemType1: 30,
      maxMemType1: 40,
      glyphNames: {}
    });
  });
});

