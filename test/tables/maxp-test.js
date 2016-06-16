var maxp = require('../../src/tables/maxp');
var expect = require('unexpected');
var c = require('concentrate');

describe('tables.maxp', function () {
  it('reads the maxp table (version 0.5)', function () {
    var data = c()
      .uint32be(0x00005000) // version
      .int16be(10)          // numGlyphs
      .result();

    expect(maxp(data), 'to equal', {
      version: 0x00005000,
      numGlyphs: 10
    });
  });

  it('reads the maxp table (version 1.0)', function () {
    var data = c()
      .uint32be(0x00010000) // version
      .uint16be(10)         // numGlyphs
      .uint16be(20)         // maxPoints
      .uint16be(30)         // maxContours
      .uint16be(40)         // maxCompositePoints
      .uint16be(50)         // maxCompositeContours
      .uint16be(60)         // maxZones
      .uint16be(70)         // maxTwilightPoints
      .uint16be(80)         // maxStorage
      .uint16be(90)         // maxFunctionDefs
      .uint16be(100)        // maxInstructionDefs
      .uint16be(110)        // maxStackElements
      .uint16be(120)        // maxSizeOfInstructions
      .uint16be(130)        // maxComponentElements
      .uint16be(140)        // maxComponentDepth
      .result();

    expect(maxp(data), 'to equal', {
			version: 0x00010000,
			numGlyphs: 10,
			maxPoints: 20,
			maxContours: 30,
			maxCompositePoints: 40,
			maxCompositeContours: 50,
			maxZones: 60,
			maxTwilightPoints: 70,
			maxStorage: 80,
			maxFunctionDefs: 90,
			maxInstructionDefs: 100,
			maxStackElements: 110,
			maxSizeOfInstructions: 120,
			maxComponentElements: 130,
			maxComponentDepth: 140
    });
  });
});

