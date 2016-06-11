var Buffer = require('../buffer');
var Type = require('../type');
var util = require('../util');

module.exports = function (dataView, font) {
  var table = new Buffer(dataView),
      numberOfHMetrics = font.tables.hhea.numberOfHMetrics,
      numGlyphs = font.tables.maxp.numGlyphs;

  var data = {};

  data.hMetrics = table.readArray(util.struct({
    advanceWidth: Type.USHORT,
    lsb: Type.SHORT
  }), numberOfHMetrics);

  data.leftSideBearing = table.readArray(Type.SHORT, numGlyphs);

  return data;
};
