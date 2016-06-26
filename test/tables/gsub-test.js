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
			.uint16be(4)						 // LookupIndex        (52) LookupList (2)
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
						100: [110]
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
				100: [110],
        101: [111]
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
				100: [10],
        101: [20]
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
        100: [ [200, 201] ],
        101: [ [300, 301] ]
      });
    });
	});
});

