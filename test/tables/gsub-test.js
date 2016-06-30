var gsub = require('../../src/tables/gsub');
var expect = require('unexpected');
var c = require('concentrate');
var ReadBuffer = require('../../src/readbuffer');

describe('tables.GSUB', function () {
  it('parses version 1.0', function () {
    var data = c()
      .uint32be(0x00010000)    // Version            (0)
      .uint16be(10)            // ScriptListOffset   (4)
      .uint16be(36)            // FeatureListOffset  (6)
      .uint16be(50)            // LookupListOffset   (8)
      .uint16be(1)             // ScriptCount        (10) ScriptList  (0)
      .string("EN  ", "ascii") // Tag                (12) ScriptList  (2)
      .uint16be(8)             // Offset             (16) ScriptList  (6)
      .uint16be(0)             // defaultLangSys     (18)             (8)   Script     (0)
      .uint16be(1)             // langSysCount       (20)             (10)  Script     (2)
      .string("GB  ", "ascii") // tag[0]             (22)             (12)  LangSysRec (4)
      .uint16be(10)            // offset[0]          (26)             (14)  LangSysRec (8)
      .uint16be(20)            // LookupOrder[0]     (28) LangSys     (16)  LangSys    (10)
      .uint16be(30)            // ReqFeatureIndex[0] (30)
      .uint16be(1)             // FeatureCount[0]    (32)
      .uint16be(0)             // FeatureIndex[0]    (34)
      .uint16be(1)             // FeatureCount       (36) FeatureList (0)
      .string("liga", "ascii") // FeatureTag         (38) FeatureList (2)
      .uint16be(8)             // FeatureOffset      (42) FeatureList (6)
      .uint16be(0)             // FeatureParams      (44)                  Feature     (0)
      .uint16be(1)             // LookupCount        (46)                  Feature     (2)
      .uint16be(0)             // LookupListIndex[0] (48)                  Feature     (4)
      .uint16be(1)             // LookupCount        (50) LookupList (0)
      .uint16be(4)             // LookupIndex        (52) LookupList (2)
      .uint16be(1)             // LookupType         (54)                  Lookup      (0)
      .uint16be(10)            // LookupFlag         (56)                  Lookup      (2)
      .uint16be(1)             // LookupTableCount   (58)                  Lookup      (4)
      .uint16be(10)            // SubtableOffset     (60)                  Lookup      (6)
      .uint16be(0)             // MarkFilteringSet   (62)                  Lookup      (8)
      .uint16be(1)             // SubstFormat        (64) Subst       (0)
      .uint16be(6)             // CoverageOffset     (66) Subst       (2)
      .int16be(10)             // DeltaGlyphID       (68) Subst       (4)
      .uint16be(1)             // CoverageFormat     (70) Coverage    (0)
      .uint16be(1)             // GlyphCount         (72) Coverage    (2)
      .uint16be(100)           // GlyphArray         (74) Coverage    (4)
      .result();

    expect(gsub(data), 'to equal', {
      'EN  ': {
        'GB  ': {
          'liga': {
            'single': {
              100: 110
            }
          }
        }
      }
    });
  });

  describe('Lookup Types', function () {
    it('parses lookup type 1: single substitution format 1', function () {
      var data = c()
        .uint16be(1)     // SubstFormat    (0)
        .uint16be(6)     // CoverageOffset (2)
        .int16be(10)     // DeltaGlyphID   (4)
        .uint16be(1)     // CoverageFormat (6)
        .uint16be(2)     // GlyphCount     (8)
        .uint16be(100)   // GlyphArray[0]  (10)
        .uint16be(101)   // GlyphArray[1]  (12)
        .result();

      expect(gsub.LookupType(new ReadBuffer(data), 1, 0), 'to equal', {
        100: 110,
        101: 111
      });
    });

    it('parses lookup type 1: single substitution format 2', function () {
       var data = c()
        .uint16be(2)     // SubstFormat    (0)
        .uint16be(10)    // CoverageOffset (2)
        .uint16be(2)     // GlyphCount     (4)
        .uint16be(10)    // GlyphID[0]     (6)
        .uint16be(20)    // GlyphID[1]     (8)
        .uint16be(1)     // CoverageFormat (10)
        .uint16be(2)     // GlyphCount     (12)
        .uint16be(100)   // GlyphArray[0]  (14)
        .uint16be(101)   // GlyphArray[1]  (16)
        .result();

      expect(gsub.LookupType(new ReadBuffer(data), 1, 0), 'to equal', {
        100: 10,
        101: 20
      });
    });

    it('parses lookup type 2: multiple substitutions subtable', function () {
      var data = c()
        .uint16be(1)      // SubstFormat       (0)
        .uint16be(10)     // CoverageOffset    (2)
        .uint16be(2)      // SequenceCount     (4)
        .uint16be(18)     // SequenceOffset[0] (6)
        .uint16be(24)     // SequenceOffset[1] (8)
        .uint16be(1)      // CoverageFormat    (10)
        .uint16be(2)      // GlyphCount        (12)
        .uint16be(100)    // GlyphArray[0]     (14)
        .uint16be(101)    // GlyphArray[1]     (16)
        .uint16be(2)      // GlyphCount        (18)
        .uint16be(200)    // GlyphID[0]        (20)
        .uint16be(201)    // GlyphID[1]        (22)
        .uint16be(2)      // GlyphCount        (24)
        .uint16be(300)    // GlyphID[0]        (26)
        .uint16be(301)    // GlyphID[1]        (28)
        .result();

      expect(gsub.LookupType(new ReadBuffer(data), 2, 0), 'to equal', {
        100: [200, 201],
        101: [300, 301]
      });
    });

    it('parses lookup type 3: alternate substitution subtable', function () {
      var data = c()
        .uint16be(1)      // SubstFormat           (0)
        .uint16be(10)     // CoverageOffset        (2)
        .uint16be(2)      // AlternateSetCount     (4)
        .uint16be(18)     // AlternateSetOffset[0] (6)
        .uint16be(24)     // AlternateSetOffset[1] (8)
        .uint16be(1)      // CoverageFormat        (10)
        .uint16be(2)      // GlyphCount            (12)
        .uint16be(100)    // GlyphArray[0]         (14)
        .uint16be(101)    // GlyphArray[1]         (16)
        .uint16be(2)      // GlyphCount            (18)
        .uint16be(200)    // Alternate[0]          (20)
        .uint16be(201)    // Alternate[1]          (22)
        .uint16be(2)      // GlyphCount            (24)
        .uint16be(300)    // Alternate[0]          (26)
        .uint16be(301)    // Alternate[1]          (28)
        .result();

      expect(gsub.LookupType(new ReadBuffer(data), 3, 0), 'to equal', {
        100: [200, 201],
        101: [300, 301]
      });
    });

    it('parses lookup type 4: ligature substitution subtable', function () {
      var data = c()
        .uint16be(1)      // SubstFormat           (0)
        .uint16be(8)      // CoverageOffset        (2)
        .uint16be(1)      // LigSetCount           (4)
        .uint16be(14)     // LigSetOffset[0]       (6)
        .uint16be(1)      // CoverageFormat        (8)
        .uint16be(1)      // GlyphCount            (10)
        .uint16be(100)    // GlyphArray[0]         (12)
        .uint16be(2)      // LigatureCount         (14) LigatureSet   (0)
        .uint16be(6)      // LigatureOffset[0]     (16) LigatureSet   (2)
        .uint16be(14)     // LigatureOffset[0]     (18) LigatureSet   (4)
        .uint16be(300)    // LigGlyph              (20) LigatureSet   (6)   Ligature[0]
        .uint16be(3)      // CompCount             (22) LigatureSet   (8)   Ligature[0]
        .uint16be(301)    // Component             (24) LigatureSet   (10)  Ligature[0]
        .uint16be(302)    // Component             (26) LigatureSet   (12)  Ligature[0]
        .uint16be(400)    // LigGlyph              (28) LigatureSet   (14)  Ligature[1]
        .uint16be(2)      // CompCount             (30) LigatureSet   (16)  Ligature[1]
        .uint16be(401)    // Component             (32) LigatureSet   (18)  Ligature[1]
        .result();

      expect(gsub.LookupType(new ReadBuffer(data), 4, 0), 'to equal', {
        100: [{
          components: [301, 302],
          ligature: 300
        }, {
          components: [401],
          ligature: 400
        }]
      });
    });

    it('parses lookup type 5: context substitution format 1', function () {
      var data = c()
        .uint16be(1)      // SubstFormat           (0)
        .uint16be(8)      // CoverageOffset        (2)
        .uint16be(1)      // SubRuleSetCount       (4)
        .uint16be(14)     // SubRuleSetOffset[0]   (6)
        .uint16be(1)      // CoverageFormat        (8)
        .uint16be(1)      // GlyphCount            (10)
        .uint16be(100)    // GlyphArray[0]         (12)
        .uint16be(2)      // SubRuleCount          (14) SubRuleSet    (0)
        .uint16be(6)      // SubRuleOffset[0]      (16) SubRuleSet    (2)
        .uint16be(16)     // SubRuleOffset[1]      (18) SubRuleSet    (4)
        .uint16be(2)      // GlyphCount            (20) SubRule[0]    (6)
        .uint16be(1)      // SubstCount            (22) SubRule[0]    (8)
        .uint16be(300)    // Input[0]              (24) SubRule[0]    (10)
        .uint16be(301)    // SequenceIndex[0]      (26) SubRule[0]    (12)
        .uint16be(302)    // LookupListIndex[0]    (28) SubRule[0]    (14)
        .uint16be(2)      // GlyphCount            (30) SubRule[1]    (16)
        .uint16be(2)      // SubstCount            (32) SubRule[1]    (18)
        .uint16be(400)    // Input[0]              (34) SubRule[1]    (20)
        .uint16be(401)    // SequenceIndex[0]      (36) SubRule[1]    (22)
        .uint16be(402)    // LookupListIndex[0]    (38) SubRule[2]    (24)
        .uint16be(403)    // SequenceIndex[1]      (40) SubRule[2]    (26)
        .uint16be(404)    // LookupListIndex[1]    (42) SubRule[2]    (28)
        .result();

      expect(gsub.LookupType(new ReadBuffer(data), 5, 0), 'to equal', {
        100: [{
          input: [300],
          records: [{ SequenceIndex: 301, LookupListIndex: 302 }]
        }, {
          input: [400],
          records: [{ SequenceIndex: 401, LookupListIndex: 402 },
                    { SequenceIndex: 403, LookupListIndex: 404 }]
        }]
      });
    });

    it('parses lookup type 5: context substitution format 2', function () {
      var data = c()
        .uint16be(2)      // SubstFormat           (0)
        .uint16be(10)     // CoverageOffset        (2)
        .uint16be(46)     // ClassDefOffset        (4)
        .uint16be(1)      // SubClassSetCount      (6)
        .uint16be(16)     // SubClassSetOffset[0]  (8)
        .uint16be(1)      // CoverageFormat        (10)
        .uint16be(1)      // GlyphCount            (12)
        .uint16be(100)    // GlyphArray[0]         (14)
        .uint16be(2)      // SubClassCount         (16) SubClassSet    (0)
        .uint16be(6)      // SubClassOffset[0]     (18) SubClassSet    (2)
        .uint16be(16)     // SubClassOffset[1]     (20) SubClassSet    (4)
        .uint16be(2)      // GlyphCount            (22) SubClass[0]    (6)
        .uint16be(1)      // SubstCount            (24) SubClass[0]    (8)
        .uint16be(300)    // Class[0]              (26) SubClass[0]    (10)
        .uint16be(301)    // SequenceIndex[0]      (28) SubClass[0]    (12)
        .uint16be(302)    // LookupListIndex[0]    (30) SubClass[0]    (14)
        .uint16be(2)      // GlyphCount            (32) SubClass[1]    (16)
        .uint16be(2)      // SubstCount            (34) SubClass[1]    (18)
        .uint16be(400)    // Class[0]              (36) SubClass[1]    (20)
        .uint16be(401)    // SequenceIndex[0]      (38) SubClass[1]    (22)
        .uint16be(402)    // LookupListIndex[0]    (40) SubClass[2]    (24)
        .uint16be(403)    // SequenceIndex[1]      (42) SubClass[2]    (26)
        .uint16be(404)    // LookupListIndex[1]    (44) SubClass[2]    (28)
        .uint16be(1)      // Format                (46) ClassDef
        .uint16be(5)      // StartGlyph            (48) ClassDef
        .uint16be(3)      // GlyphCount            (50) ClassDef
        .uint16be(10)     // ClassValue[0]         (52) ClassDef
        .uint16be(20)     // ClassValue[1]         (54) ClassDef
        .uint16be(30)     // ClassValue[2]         (56) ClassDef
        .result();

      expect(gsub.LookupType(new ReadBuffer(data), 5, 0), 'to equal', {
      });
    });

    it('parses lookup type 5: context substitution format 3', function () {
      var data = c()
        .uint16be(3)      // SubstFormat           (0)
        .uint16be(2)      // GlyphCount            (2)
        .uint16be(2)      // SubstCount            (4)
        .uint16be(18)     // CoverageOffset[0]     (6)
        .uint16be(24)     // CoverageOffset[1]     (8)
        .uint16be(200)    // SequenceIndex[0]      (10) SubstLookupRecord[0]
        .uint16be(201)    // LookupListIndex[0]    (12) SubstLookupRecord[0]
        .uint16be(300)    // SequenceIndex[1]      (14) SubstLookupRecord[1]
        .uint16be(301)    // LookupListIndex[1]    (16) SubstLookupRecord[1]
        .uint16be(1)      // CoverageFormat        (18) Coverage[0]
        .uint16be(1)      // GlyphCount            (20) Coverage[0]
        .uint16be(50)     // GlyphArray[0]         (22) Coverage[0]
        .uint16be(1)      // CoverageFormat        (24) Coverage[1]
        .uint16be(2)      // GlyphCount            (26) Coverage[1]
        .uint16be(100)    // GlyphArray[0]         (28) Coverage[1]
        .uint16be(101)    // GlyphArray[1]         (30) Coverage[1]
        .result();

      expect(gsub.LookupType(new ReadBuffer(data), 5, 0), 'to equal', {
      });
    });

    it('parses lookup type 6: chaining context substitution format 1', function () {
    });

    it('parses lookup type 6: chaining context substitution format 2', function () {
    });

    it('parses lookup type 6: chaining context substitution format 3', function () {
    });

    it('parses lookup type 7: extension substitution', function () {
      var data = c()
        .uint16be(1)     // SubstFormat         (0)
        .uint16be(1)     // ExtensionLookupType (2)
        .uint32be(8)     // ExtensionOffset     (4)
        .uint16be(1)     // SubstFormat         (8)
        .uint16be(6)     // CoverageOffset      (10)
        .int16be(10)     // DeltaGlyphID        (12)
        .uint16be(1)     // CoverageFormat      (14)
        .uint16be(2)     // GlyphCount          (16)
        .uint16be(100)   // GlyphArray[0]       (18)
        .uint16be(101)   // GlyphArray[1]       (20)
        .result();

      expect(gsub.LookupType(new ReadBuffer(data), 7, 0), 'to equal', {
        100: 110,
        101: 111
      });
    });

    it('parses lookup type 8: reverse chaining contextual single substitution format 1', function () {

    });
  });
});

