var cmap = require('../../src/tables/cmap');
var expect = require('unexpected');
var c = require('concentrate');

describe('tables.cmap', function () {
  it('parses format 0', function () {
    var buffer = c()
      .uint16be(0)   // version    (0)
      .uint16be(1)   // numTables  (2)
      .uint16be(1)   // platformID (4)
      .uint16be(1)   // encodingID (6)
      .uint32be(12)  // offset     (8)
      .uint16be(0)   // format
      .uint16be(256) // length
      .uint16be(0);   // language

    var charCodes = {};

    for (var i = 0; i < 256; i++) {
      charCodes[i] = 255 - i;
      buffer.uint8(255 - i);
    }

    expect(cmap(buffer.result(), {}), 'to equal', [{
      format: 0,
      platformID: 1,
      encodingID: 1,
      language: 0,
      charCodes: charCodes
    }]);
  });

  it('parses format 4', function () {
    var buffer = c()
      .uint16be(0)      // version       (0)
      .uint16be(1)      // numTables     (2)
      .uint16be(1)      // platformID    (4)
      .uint16be(1)      // encodingID    (6)
      .uint32be(12)     // offset        (8)
      .uint16be(4)      // format        (12)
      .uint16be(256)    // length        (14)
      .uint16be(0)      // language      (16)
      .uint16be(8)      // segCountX2    (18)
      .uint16be(8)      // searchRange   (20)
      .uint16be(4)      // entrySelector (22)
      .uint16be(0)      // rangeShift    (24)
      .uint16be(20)     // endCode[0]
      .uint16be(90)     // endCode[1]
      .uint16be(480)    // endCode[2]
      .uint16be(0xffff) // endCode[3]
      .uint16be(0)      // reservedPad
      .uint16be(10)     // startCode[0]
      .uint16be(30)     // startCode[1]
      .uint16be(153)    // startCode[2]
      .uint16be(0xffff) // startCode[3]
      .int16be(-9)      // idDelta[0]
      .int16be(-18)     // idDelta[1]
      // TODO: This example is from the spec, but the given value "-27"
      // does not create a contiguous range.
      .int16be(-80)     // idDelta[2]
      .int16be(1)       // idDelta[3]
      .uint16be(0)      // idRangeOffset[0]
      .uint16be(0)      // idRangeOffset[1]
      .uint16be(0)      // idRangeOffset[2]
      .uint16be(0)      // idRangeOffser[3]

    var charCodes = {};

    for (var charCode = 10; charCode <= 20; charCode++) {
      charCodes[charCode] = charCode - 9;
    }

    for (var charCode = 30; charCode <= 90; charCode++) {
      charCodes[charCode] = charCode - 18;
    }

    for (var charCode = 153; charCode <= 480; charCode++) {
      charCodes[charCode] = charCode - 80;
    }

    expect(cmap(buffer.result(), {}), 'to equal', [{
      format: 4,
      platformID: 1,
      encodingID: 1,
      language: 0,
      charCodes: charCodes
    }]);
  });

  it('parses format 12', function () {
    var buffer = c()
      .uint16be(0)      // version       (0)
      .uint16be(1)      // numTables     (2)
      .uint16be(1)      // platformID    (4)
      .uint16be(1)      // encodingID    (6)
      .uint32be(12)     // offset        (8)
      .uint16be(12)     // format        (12)
      .uint16be(0)      // reserved      (14)
      .uint32be(256)    // length        (16)
      .uint32be(0)      // language      (20)
      .uint32be(2)      // nGroups       (24)
      .uint32be(32)     // starCharCode[0]
      .uint32be(34)     // endCharCode[0]
      .uint32be(1)      // startGlyphId[0]
      .uint32be(50)     // startCharCode[1]
      .uint32be(55)     // endCharCode[1]
      .uint32be(4)      // startGlyphId[1]

    var charCodes = {
      32: 1,
      33: 2,
      34: 3,
      50: 4,
      51: 5,
      52: 6,
      53: 7,
      54: 8,
      55: 9
    };

    expect(cmap(buffer.result(), {}), 'to equal', [{
      format: 12,
      platformID: 1,
      encodingID: 1,
      language: 0,
      charCodes: charCodes
    }]);
  });

  it('parses format 13', function () {
    var buffer = c()
      .uint16be(0)      // version       (0)
      .uint16be(1)      // numTables     (2)
      .uint16be(1)      // platformID    (4)
      .uint16be(1)      // encodingID    (6)
      .uint32be(12)     // offset        (8)
      .uint16be(13)     // format        (12)
      .uint16be(0)      // reserved      (14)
      .uint32be(256)    // length        (16)
      .uint32be(0)      // language      (20)
      .uint32be(2)      // nGroups       (24)
      .uint32be(32)     // starCharCode[0]
      .uint32be(34)     // endCharCode[0]
      .uint32be(1)      // startGlyphId[0]
      .uint32be(50)     // startCharCode[1]
      .uint32be(55)     // endCharCode[1]
      .uint32be(4)      // startGlyphId[1]

    var charCodes = {
      32: 1,
      33: 1,
      34: 1,
      50: 4,
      51: 4,
      52: 4,
      53: 4,
      54: 4,
      55: 4
    };

    expect(cmap(buffer.result(), {}), 'to equal', [{
      format: 13,
      platformID: 1,
      encodingID: 1,
      language: 0,
      charCodes: charCodes
    }]);
  });

  it('parses format 14', function () {
    var buffer = c()
      .uint16be(0)      // version       (0)
      .uint16be(1)      // numTables     (2)
      .uint16be(1)      // platformID    (4)
      .uint16be(1)      // encodingID    (6)
      .uint32be(12)     // offset        (8)
      .uint16be(14)     // format        (12)
      .uint32be(256)    // length        (14)
      .uint32be(1)      // numVarSelectorRecords (18)
      .buffer(new Buffer([0, 0, 0])) // varSelector (22)
      .uint32be(33)     // defaultUVSOffset (25)
      .uint32be(0)      // nonDefaultUVSOffset (29)
      .uint32be(1)      // numUnicodeValueRanges (33)
      .buffer(new Buffer([0, 0, 1])) // startUnicodeValue
      .uint8(0);

    expect(cmap(buffer.result(), {}), 'to equal', [{
      format: 14,
      platformID: 1,
      encodingID: 1,
      language: 0,
      charCodes: {}
    }]);
  });

  it('parses multiple formats', function () {
    var buffer = c()
      .uint16be(0)   // version         (0)
      .uint16be(2)   // numTables       (2)
      .uint16be(1)   // platformID[0]   (4)
      .uint16be(1)   // encodingID[0]   (6)
      .uint32be(20)  // offset[0]       (8)
      .uint16be(1)   // platformID[1]   (12)
      .uint16be(1)   // encodingID[1]   (14)
      .uint32be(48)  // offset[1]       (16)
      .uint16be(12)  // format          (20)
      .uint16be(0)   // reserved        (22)
      .uint32be(256) // length          (24)
      .uint32be(0)   // language        (28)
      .uint32be(1)   // nGroups         (32)
      .uint32be(10)  // starCharCode[0] (36)
      .uint32be(15)  // endCharCode[0]  (40)
      .uint32be(1)   // startGlyphId[0] (44)
      .uint16be(13)  // format          (48)
      .uint16be(0)   // reserved
      .uint32be(256) // length
      .uint32be(0)   // language
      .uint32be(1)   // nGroups
      .uint32be(25)  // starCharCode[0]
      .uint32be(30)  // endCharCode[0]
      .uint32be(1);  // startGlyphId[0]

    expect(cmap(buffer.result(), {}), 'to equal', [{
      format: 12,
      platformID: 1,
      encodingID: 1,
      language: 0,
      charCodes: {
        10: 1,
        11: 2,
        12: 3,
        13: 4,
        14: 5,
        15: 6
      }
    }, {
      format: 13,
      platformID: 1,
      encodingID: 1,
      language: 0,
      charCodes: {
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        29: 1,
        30: 1
      }
    }]);
  });
});
