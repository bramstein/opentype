var common = require('../../src/tables/common');
var expect = require('unexpected');
var c = require('concentrate');
var ReadBuffer = require('../../src/readbuffer');

describe('tables.common', function () {
  it('parses a List', function () {
    var data = c()
      .uint16be(2)             // count
      .string("ONE ", "ascii") // tag[0]
      .uint16be(10)            // offset[0]
      .string("TWO ", "ascii") // tag[1]
      .uint16be(20)            // ofset[1]
      .result();

    expect(common.List(new ReadBuffer(data), 0, function (buffer, offset) {
      return offset;
    }), 'to equal', [{
      tag: "ONE ",
      table: 10
    }, {
      tag: "TWO ",
      table: 20
    }]);
  });

  it('parses a Script record', function () {
    var data = c()
      .uint16be(0)             // defaultLangSys     (0)
      .uint16be(1)             // langSysCount       (2)
      .string("EN  ", "ascii") // tag[0]             (4)
      .uint16be(10)            // offset[0]          (8)
      .uint16be(20)            // LookupOrder[0]     (10)
      .uint16be(30)            // ReqFeatureIndex[0] (12)
      .uint16be(1)             // FeatureCount[0]    (14)
      .uint16be(40)            // FeatureIndex[0]    (16)
      .result();

    expect(common.Script(new ReadBuffer(data), 0), 'to equal', [{
      tag: "EN  ",
      table: {
        LookupOrder: 20,
        ReqFeatureIndex: 30,
        FeatureCount: 1,
        FeatureIndex: [40]
      }
    }]);
  });

  it('parses two Script records', function () {
    var data = c()
      .uint16be(0)             // defaultLangSys     (0)
      .uint16be(2)             // langSysCount       (2)
      .string("EN  ", "ascii") // tag[0]             (4)
      .uint16be(16)            // offset[0]          (8)
      .string("NL  ", "ascii") // tag[1]             (10)
      .uint16be(24)            // offset [1]         (14)

      .uint16be(20)            // LookupOrder[0]     (16)
      .uint16be(30)            // ReqFeatureIndex[0] (18)
      .uint16be(1)             // FeatureCount[0]    (20)
      .uint16be(40)            // FeatureIndex[0]    (22)

      .uint16be(60)            // LookupOrder[1]     (24)
      .uint16be(70)            // ReqFeatureIndex[1] (26)
      .uint16be(1)             // FeatureCount[1]    (28)
      .uint16be(80)            // FeatureIndex[1]    (30)
      .result();

    expect(common.Script(new ReadBuffer(data), 0), 'to equal', [{
      tag: "EN  ",
      table: {
        LookupOrder: 20,
        ReqFeatureIndex: 30,
        FeatureCount: 1,
        FeatureIndex: [40]
      }
    },  {
      tag: "NL  ",
      table: {
        LookupOrder: 60,
        ReqFeatureIndex: 70,
        FeatureCount: 1,
        FeatureIndex: [80]
      }
    }]);
  });

  it('parses a Script record with default language', function () {
    var data = c()
      .uint16be(10)            // defaultLangSys     (0)
      .uint16be(1)             // langSysCount       (2)
      .string("EN  ", "ascii") // tag[0]             (4)
      .uint16be(18)            // offset[0]          (8)

      .uint16be(20)            // LookupOrder[0]     (10)
      .uint16be(30)            // ReqFeatureIndex[0] (12)
      .uint16be(1)             // FeatureCount[0]    (14)
      .uint16be(40)            // FeatureIndex[0]    (16)

      .uint16be(60)            // LookupOrder[1]     (18)
      .uint16be(70)            // ReqFeatureIndex[1] (20)
      .uint16be(1)             // FeatureCount[1]    (22)
      .uint16be(80)            // FeatureIndex[1]    (24)
      .result();

    expect(common.Script(new ReadBuffer(data), 0), 'to equal', [{
      tag: "DFLT",
      table: {
        LookupOrder: 20,
        ReqFeatureIndex: 30,
        FeatureCount: 1,
        FeatureIndex: [40]
      }
    },  {
      tag: "EN  ",
      table: {
        LookupOrder: 60,
        ReqFeatureIndex: 70,
        FeatureCount: 1,
        FeatureIndex: [80]
      }
    }]);
  });

  it('parses a LangSys record', function () {
    var data = c()
      .uint16be(1)  // lookupOrder (0)
      .uint16be(2)  // reqFeatureIndex (2)
      .uint16be(3)  // featureCount
      .uint16be(10) // featureIndex[0]
      .uint16be(20) // featureIndex[1]
      .uint16be(30) // featureIndex[2]
      .result();

    expect(common.LangSys(new ReadBuffer(data), 0), 'to equal', {
      LookupOrder: 1,
      ReqFeatureIndex: 2,
      FeatureCount: 3,
      FeatureIndex: [10, 20, 30]
    });
  });

  it('parses a Feature record', function () {
    var data = c()
      .uint16be(1)  // FeatureParams
      .uint16be(3)  // LookupCount
      .uint16be(10) // LookupListIndex[0]
      .uint16be(20) // LookupListIndex[1]
      .uint16be(30) // LookupListIndex[2]
      .result();

    expect(common.Feature(new ReadBuffer(data), 0), 'to equal', {
      FeatureParams: 1,
      LookupCount: 3,
      LookupListIndex: [10, 20, 30]
    });
  });

  it('parses a Lookup record', function () {
    var data = c()
      .uint16be(1)  // LookupType
      .uint16be(2)  // LookupFlag
      .uint16be(2)  // SubTableCount
      .uint16be(10) // SubTable[0]
      .uint16be(20) // SubTable[1]
      .uint16be(3)  // MarkFilteringSet
      .result();

    expect(common.Lookup(new ReadBuffer(data), 0, function (buffer, lookupType, offset) {
      return offset;
    }), 'to equal', {
      LookupType: 1,
      LookupFlag: 2,
      SubTable: [10, 20],
      MarkFilteringSet: 3
    });
  });

  it('parses a LookupList', function () {
    var data = c()
      .uint16be(2)  // Count               (0)
      .uint16be(6)  // Offset[0]           (2)
      .uint16be(18) // Offset[1]           (4)
      .uint16be(1)  // LookupType[0]       (6)
      .uint16be(2)  // LookupFlag[0]       (8)
      .uint16be(2)  // SubTableCount[0]    (10)
      .uint16be(10) // SubTable[0][0]      (12)
      .uint16be(20) // SubTable[0][1]      (14)
      .uint16be(3)  // MarkFilteringSet[0] (16)
      .uint16be(2)  // LookupType[1]       (18)
      .uint16be(4)  // LookupFlag[1]       (20)
      .uint16be(2)  // SubTableCount[1]    (22)
      .uint16be(50) // SubTable[1][0]      (24)
      .uint16be(60) // SubTable[1][1]      (26)
      .uint16be(4)  // MarkFilteringSet[1] (28)
      .result();

    expect(common.LookupList(new ReadBuffer(data), 0, function (buffer, lookupType, offset) {
      return offset;
    }), 'to equal', [{
      LookupType: 1,
      LookupFlag: 2,
      SubTable: [16, 26],
      MarkFilteringSet: 3
    }, {
      LookupType: 2,
      LookupFlag: 4,
      SubTable: [68, 78],
      MarkFilteringSet: 4
    }]);
  });

  it('parses a Coverage record (format 1)', function () {
    var data = c()
      .uint16be(1) // Format
      .uint16be(2) // GlyphCount
      .uint16be(5) // GlyphId[0]
      .uint16be(6) // GlyphId[1]
      .result();

    expect(common.Coverage(new ReadBuffer(data), 0), 'to equal', [5, 6]);
  });

  it('parses a Coverage record (format 2)', function () {
    var data = c()
      .uint16be(2)  // Format
      .uint16be(2)  // GlyphCount
      .uint16be(0)  // Start[0]
      .uint16be(5)  // End[0]
      .uint16be(10) // StartCoverageIndex[0]
      .uint16be(10) // Start[1]
      .uint16be(15) // End[1]
      .uint16be(20) // StartCoverageIndex[1]
      .result();

    expect(common.Coverage(new ReadBuffer(data), 0), 'to equal', [10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25]);
  });

  it('parses a ClassDef definition table (format 1)', function () {
    var data = c()
      .uint16be(1)  // Format
      .uint16be(5)  // StartGlyph
      .uint16be(3)  // GlyphCount
      .uint16be(10) // ClassValue[0]
      .uint16be(20) // ClassValue[1]
      .uint16be(30) // ClassValue[2]
      .result();

    expect(common.ClassDef(new ReadBuffer(data), 0), 'to equal', {
      5: 10,
      6: 20,
      7: 30
    });
  });

  it('parses a ClassDef definition table (format 2)', function () {
    var data = c()
      .uint16be(2)  // Format
      .uint16be(2)  // ClassRangeCount
      .uint16be(10) // Start[0]
      .uint16be(15) // End[0]
      .uint16be(1)  // Class[0]
      .uint16be(20) // Start[1]
      .uint16be(25) // End[1]
      .uint16be(2)  // Class[1]
      .result();

    expect(common.ClassDef(new ReadBuffer(data), 0), 'to equal', {
      10: 1,
      11: 1,
      12: 1,
      13: 1,
      14: 1,
      15: 1,
      20: 2,
      21: 2,
      22: 2,
      23: 2,
      24: 2,
      25: 2
    });
  });
});
