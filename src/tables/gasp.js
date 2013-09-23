goog.provide('opentype.tables.gasp');

goog.require('opentype.Buffer');
goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Buffer = opentype.Buffer,
      tables = opentype.tables,
      Type = opentype.Type,
      util = opentype.util;

  tables.gasp = function (dataView, font) {
    var table = new Buffer(dataView);

    var version = table.read(Type.USHORT);
    var data = {};

    data['gaspRange'] = table.readArray(util.struct({
      'rangeMaxPPEM': Type.USHORT,
      'rangeGaspBehavior': Type.USHORT
    }), table.read(Type.USHORT));

    return data;
  };
});
