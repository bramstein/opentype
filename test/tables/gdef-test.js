var gdef = require('../../src/tables/gdef');
var expect = require('unexpected');
var c = require('concentrate');

describe('tables.gdef', function () {
  it('parses version 1.0', function () {
    var buffer = c()
      .uint32be(0x00010000)   // Version            (0)
      .uint16be(12)           // GlyphClassDef      (4)
      .uint16be(0)            // AttachList         (6)
      .uint16be(0)            // LigCaretList       (8)
      .uint16be(0)            // MarkAttachClassDef (10)
      .uint16be(1)            // Format             (12)
      .uint16be(5)            // StartGlyph         (14)
      .uint16be(3)            // GlyphCount         (16)
      .uint16be(10)           // ClassValue[0]      (18)
      .uint16be(20)           // ClassValue[1]      (20)
      .uint16be(30)           // ClassValue[2]      (22)
      .result();

    expect(gdef(buffer), 'to equal', {
      GlyphClassDef: { 5: 10, 6: 20, 7: 30 }
    });
  });

  it('parses version 1.2', function () {
    var buffer = c()
      .uint32be(0x00010002)   // Version
      .uint16be(14)           // GlyphClassDef      (4)
      .uint16be(1)            // AttachList         (6)
      .uint16be(1)            // LigCaretList       (8)
      .uint16be(1)            // MarkAttachClassDef (10)
      .uint16be(1)            // MarkGlyphSetsDef   (12)
      .uint16be(1)            // Format             (14)
      .uint16be(5)            // StartGlyph         (16)
      .uint16be(3)            // GlyphCount         (18)
      .uint16be(10)           // ClassValue[0]      (20)
      .uint16be(20)           // ClassValue[1]      (22)
      .uint16be(30)           // ClassValue[2]      (24)
      .result();

      expect(gdef(buffer), 'to equal', {
        GlyphClassDef: { 5: 10, 6: 20, 7: 30 }
      });
  });
});
