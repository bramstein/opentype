var ReadBuffer = require('../readbuffer');
var Type = require('../type');
var util = require('../util');

module.exports = function (buffer, font) {
  var table = new ReadBuffer(buffer),
      numberOfHMetrics = font.tables.hhea.numberOfHMetrics,
      numGlyphs = font.tables.maxp.numGlyphs - numberOfHMetrics;

  var data = {};

  data.hMetrics = table.readArray(util.struct({
    advanceWidth: Type.USHORT,
    lsb: Type.SHORT
  }), numberOfHMetrics);

  data.leftSideBearing = table.readArray(Type.SHORT, numGlyphs);

  return data;
};
