var hhea = require('../../src/tables/hhea');
var expect = require('unexpected');
var c = require('concentrate');

describe('tables.hhea', function () {
  it('reads the hhea table', function () {
    var data = c()
      .uint32be(0x00010000) // version
      .int16be(10)          // Ascender
      .int16be(20)          // Descender
      .int16be(30)          // lineGap
      .uint16be(40)         // advanceWidthMax
      .int16be(50)          // minLeftSideBearing
      .int16be(60)          // minRightSideBearing
      .int16be(70)          // xMaxExtent
      .int16be(80)          // caretSlopeRise
      .int16be(90)          // caretSlopeRun
      .int16be(100)         // caretOffset
      .int16be(0)           // reserved
      .int16be(0)           // reserved
      .int16be(0)           // reserved
      .int16be(0)           // reserved
      .int16be(0)           // metricDataFormat
      .uint16be(200)        // numberOfHMetrics
      .result();

    expect(hhea(data), 'to equal', {
      version: 0x00010000,
      ascender: 10,
      descender: 20,
      lineGap: 30,
      advanceWidthMax: 40,
      minLeftSideBearing: 50,
      minRightSideBearing: 60,
      xMaxExtent: 70,
      caretSlopeRise: 80,
      caretSlopeRun: 90,
      caretOffset: 100,
      reserved1: 0,
      reserved2: 0,
      reserved3: 0,
      reserved4: 0,
      metricDataFormat: 0,
      numberOfHMetrics: 200
    });
  });
});

