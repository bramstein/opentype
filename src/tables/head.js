goog.provide('opentype.tables.head');

goog.require('opentype.Reader');
goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Reader = opentype.Reader,
      Type = opentype.Type,
      tables = opentype.tables,
      util = opentype.util;

  tables.head = function (dataView, font) {
    var table = new Reader(dataView);

    return table.read(util.struct({
      'version': Type.FIXED,
      'fontRevision': Type.FIXED,
      'checkSumAdjustment': Type.ULONG,
      'magicNumber': Type.ULONG,
      'flags': Type.USHORT,
      'unitsPerEm': Type.USHORT,
      'created': Type.LONGDATETIME,
      'modified': Type.LONGDATETIME,
      'xMin': Type.SHORT,
      'yMin': Type.SHORT,
      'xMax': Type.SHORT,
      'yMax': Type.SHORT,
      'macStyle': Type.USHORT,
      'lowestRecPPEM': Type.USHORT,
      'fontDirectionHint': Type.SHORT,
      'indexToLocFormat': Type.SHORT,
      'glyphDataFormat': Type.SHORT
    }));
  };
});
