var sbix = require('../../src/tables/sbix');
var expect = require('unexpected');
var c = require('concentrate');

describe('tables.sbix', function () {
  it('reads sbix table with no strikes', function () {
    var data = c()
      .uint16be(0x0001) // version
      .uint16be(0x0001) // flags - least-significant bit should be set to 1
      .uint32be(0) // numStrikes
      .result();

    var font = {
      tables: {
        maxp: {
          numGlyphs: 0
        }
      }
    };

    expect(sbix(data, font), 'to equal', {
      version: 1,
      flags: 1,
      strikes: []
    });
  });

  it('reads sbix table with strikes and no glyphs', function () {
    var data = c()
      .uint16be(0x0001) // version
      .uint16be(0x0001) // flags - least-significant bit should be set to 1
      .uint32be(2) // numStrikes
      .uint32be(16) // offset to strike #1 (from beginning of table)
      .uint32be(16 + 8) // offset to strike #2 (from beginning of table)
      // strike #1
      .uint16be(10) // ppem
      .uint16be(72) // ppi
      .uint32be(0) // offsets to glyphs - `maxp.numGlyphs` + 1
      // strike #2
      .uint16be(20) // ppem
      .uint16be(72) // ppi
      .uint32be(0) // offsets to glyphs - `maxp.numGlyphs` + 1
      .result();

    var font = {
      tables: {
        maxp: {
          numGlyphs: 0
        }
      }
    };

    expect(sbix(data, font), 'to equal', {
      version: 1,
      flags: 1,
      strikes: [{
        ppem: 10,
        ppi: 72,
        glyphs: []
      }, {
        ppem: 20,
        ppi: 72,
        glyphs: []
      }]
    });
  });

  it('reads sbix table with strike with glyphs', function () {
    var data = c()
      .uint16be(0x0001) // version
      .uint16be(0x0001) // flags - least-significant bit should be set to 1
      .uint32be(1) // numStrikes
      .uint32be(12) // offset to strike (from beginning of table)
      // strike
      .uint16be(10) // ppem
      .uint16be(72) // ppi
      // offsets to glyphs (from beginning of strike) - `maxp.numGlyphs` + 1
      .uint32be(16) // offsets to glyph #1
      .uint32be(16 + 12) // offsets to glyph #2
      .uint32be(16 + 12 + 12) // offsets to first byte after last glyph
      // array of glyphs (with valid headers and fake data)
      // glyph #1
      .uint16be(0) //originOffsetX
      .uint16be(0) // originOffsetY
      .string('test', 'utf-8') // graphicType (four characters)
      .uint32be(0x11000011) // data
      // glyph #2
      .uint16be(0) //originOffsetX
      .uint16be(0) // originOffsetY
      .string('test', 'utf-8') // graphicType (four characters)
      .uint32be(0x22000022) // data
      .result();

    var font = {
      tables: {
        maxp: {
          numGlyphs: 2
        }
      }
    };

    expect(sbix(data, font), 'to equal', {
      version: 1,
      flags: 1,
      strikes: [{
        ppem: 10,
        ppi: 72,
        glyphs: [{
          originOffsetX: 0,
          originOffsetY: 0,
          graphicType: 'test',
          data: c().uint32be(0x11000011).result()
        }, {
          originOffsetX: 0,
          originOffsetY: 0,
          graphicType: 'test',
          data: c().uint32be(0x22000022).result()
        }]
      }]
    });
  });
});

