var head = require('../../src/tables/head');
var expect = require('unexpected');
var c = require('concentrate');
var Int64 = require('node-int64');

describe('tables.head', function () {
  it('reads head table', function () {
    var created = Date.now();
    var modified = Date.now();

    var data = c()
      .uint32be(0x00010000) // version 1.0
      .uint32be(0x00000001) // fontRevision
      .uint32be(0xB1B0AFBA) // checkSumAdjustment
      .uint32be(0x5F0F3CF5) // magicNumber
      .uint16be(0x1010)     // flags
      .uint16be(32)         // unitsPerEm
      .buffer(new Int64(created).toBuffer())    // created
      .buffer(new Int64(modified).toBuffer())   // modified
      .int16be(-10)         // xMin
      .int16be(-20)         // yMin
      .int16be(50)          // xMax
      .int16be(80)          // yMax
      .uint16be(0x1010)     // macStyle
      .uint16be(14)         // lowestRecPPEM
      .int16be(2)           // fontDirectionHint
      .int16be(1)           // indexToLocFormat
      .int16be(0)           // glyphDataFormat
      .result();

    expect(head(data), 'to equal', {
      version: 0x00010000,
      fontRevision: 0x00000001,
      checkSumAdjustment: 0xB1B0AFBA,
      magicNumber: 0x5F0F3CF5,
      flags: 0x1010,
      unitsPerEm: 32,
      created: new Int64(created),
      modified: new Int64(modified),
      xMin: -10,
      yMin: -20,
      xMax: 50,
      yMax: 80,
      macStyle: 0x1010,
      lowestRecPPEM: 14,
      fontDirectionHint: 2,
      indexToLocFormat: 1,
      glyphDataFormat: 0
    });
  });
});
