goog.provide('opentype.tables.post');

goog.require('opentype.Reader');
goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Reader = opentype.Reader,
      Type = opentype.Type,
      tables = opentype.tables,
      util = opentype.util;

  tables.post = function (dataView, font) {
    var table = new Reader(dataView);

    var data = table.read(util.struct({
      'version': Type.FIXED,
      'italicAngle': Type.FIXED,
      'underlinePosition': Type.FWORD,
      'underlineThickness': Type.FWORD,
      'isFixedPitch': Type.ULONG,
      'minMemType42': Type.ULONG,
      'maxMemType42': Type.ULONG,
      'minMemType1': Type.ULONG,
      'maxMemType1': Type.ULONG
    }));

    return data;
  };
});
