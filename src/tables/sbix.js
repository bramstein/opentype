// Specs: https://docs.microsoft.com/en-us/typography/opentype/spec/sbix

var ReadBuffer = require('../readbuffer');
var Type = require('../type');
var util = require('../util');

var SbixHeader = util.struct({
  version: Type.USHORT,
  flags: Type.USHORT,
  numStrikes: Type.ULONG
});

var StrikeHeader = util.struct({
  ppem: Type.USHORT,
  ppi: Type.USHORT
});

var GlyphHeader = util.struct({
  originOffsetX: Type.USHORT,
  originOffsetY: Type.USHORT,
  graphicType: Type.TAG
});

module.exports = function (buffer, font) {
  var table = new ReadBuffer(buffer);
  var data = {};

  var numGlyphs = font.tables.maxp.numGlyphs;

  util.extend(data, table.read(SbixHeader));

  // version should be 1
  if (data.version !== 1) return buffer;
  // least-significant bit should be set to 1
  if (data.flags & 1 !== 1) return buffer;

  data.strikes = [];

  var strikeOffsets = table.readArray(Type.ULONG, data.numStrikes);
  strikeOffsets.forEach(function(strikeOffset) {
    table.goto(strikeOffset);
    var strike = table.read(StrikeHeader);
    strike.glyphs = [];
    var glyphDataOffsets = table.readArray(Type.ULONG, numGlyphs + 1);

    for (var i = 0; i < numGlyphs; i++) {
      var glyphDataStart = strikeOffset + glyphDataOffsets[i];
      var glyphDataEnd = strikeOffset + glyphDataOffsets[i + 1];
      if (glyphDataEnd - glyphDataStart >= GlyphHeader.sizeof) {
        table.goto(glyphDataStart);
        var glyph = table.read(GlyphHeader);
        glyph.data = buffer.slice(glyphDataStart + GlyphHeader.sizeof, glyphDataEnd);
        strike.glyphs.push(glyph);
      } else {
        strike.glyphs.push(null);
      }
    }

    data.strikes.push(strike);
  });

  delete data.numStrikes;
  return data;
};
