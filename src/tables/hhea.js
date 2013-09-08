goog.provide('opentype.tables.hhea');

goog.require('opentype.Buffer');
goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Buffer = opentype.Buffer,
      Type = opentype.Type,
      tables = opentype.tables,
      util = opentype.util;

  tables.hhea = function (dataView, font) {
    var table = new Buffer(dataView);

    return table.read(util.struct({
      'version': Type.FIXED,
      'Ascender': Type.FWORD,
      'Descender': Type.FWORD,
      'LineGap': Type.FWORD,
      'advanceWidthMax': Type.UFWORD,
      'minLeftSideBearing': Type.FWORD,
      'minRightSideBearing': Type.FWORD,
      'xMaxExtent': Type.FWORD,
      'caretSlopeRise': Type.SHORT,
      'caretOffset': Type.SHORT,
      'reserved1': Type.SHORT,
      'reserved2': Type.SHORT,
      'reserved3': Type.SHORT,
      'reserved4': Type.SHORT,
      'metricDataFormat': Type.SHORT,
      'numberOfHMetrics': Type.USHORT
    }));
  };
});
