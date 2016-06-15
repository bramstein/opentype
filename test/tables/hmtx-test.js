var hmtx = require('../../src/tables/hmtx');
var expect = require('unexpected');
var c = require('concentrate');

describe('tables.hmtx', function () {
  it('reads the hmtx table', function () {
    var data = c()
      .uint16be(1)      // advanceWidth[0]
      .uint16be(2)      // lsb[0]
      .uint16be(3)      // advanceWidth[1]
      .uint16be(4)      // lsb[1]
      .uint16be(5)      // leftSideBearing[0]
      .uint16be(6)      // leftSideBearing[1]
      .result();

    expect(hmtx(data, {
      tables: {
        maxp: {
          numGlyphs: 4
        },
        hhea: {
          numberOfHMetrics: 2
        }
      }
    }), 'to equal', {
      hMetrics: [{
        advanceWidth: 1,
        lsb: 2
      }, {
        advanceWidth: 3,
        lsb: 4
      }],
      leftSideBearing: [5, 6]
    });
  });

  it('reads the hmtx table without leftSideBearing', function () {
    var data = c()
      .uint16be(1)      // advanceWidth[0]
      .uint16be(2)      // lsb[0]
      .uint16be(3)      // advanceWidth[1]
      .uint16be(4)      // lsb[1]
      .result();

    expect(hmtx(data, {
      tables: {
        maxp: {
          numGlyphs: 2
        },
        hhea: {
          numberOfHMetrics: 2
        }
      }
    }), 'to equal', {
      hMetrics: [{
        advanceWidth: 1,
        lsb: 2
      }, {
        advanceWidth: 3,
        lsb: 4
      }],
      leftSideBearing: []
    });
  });

  it('reads an empty hmtx table', function () {
    var data = c().result();

    expect(hmtx(data, {
      tables: {
        maxp: {
          numGlyphs: 0
        },
        hhea: {
          numberOfHMetrics: 0
        }
      }
    }), 'to equal', {
      hMetrics: [],
      leftSideBearing: []
    });
  });
});
