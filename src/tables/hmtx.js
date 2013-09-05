goog.provide('opentype.tables.hmtx');

goog.require('opentype.Reader');
goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Reader = opentype.Reader,
      tables = opentype.tables,
      Type = opentype.Type,
      util = opentype.util;

  tables.hmtx = function (dataView, font) {
    var table = new Reader(dataView),
        numberOfHMetrics = font['tables']['hhea']['numberOfHMetrics'],
        numGlyphs = font['tables']['maxp']['numGlyphs'];

    var data = {};

    data['hMetrics'] = table.readArray(util.struct({
      'advanceWidth': Type.USHORT,
      'lsb': Type.SHORT
    }), numberOfHMetrics);

    data['leftSideBearing'] = table.readArray(Type.SHORT, numGlyphs);

    return data;
  };
});
