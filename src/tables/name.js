goog.provide('opentype.tables.name');

goog.require('opentype.Type');
goog.require('opentype.Reader');
goog.require('opentype.util');

goog.scope(function () {
  var Type = opentype.Type,
      Reader = opentype.Reader,
      util = opentype.util,
      tables = opentype.tables;

  tables.name = function (dataView, font) {
    var table = new Reader(dataView);

    var data = table.read(util.struct({
      'format': Type.USHORT,
      'count': Type.USHORT,
      'stringOffset': Type.USHORT
    }));

    data['nameRecord'] = table.readArray(util.struct({
      'platformID': Type.USHORT,
      'encodingID': Type.USHORT,
      'languageID': Type.USHORT,
      'nameID': Type.USHORT,
      'length': Type.USHORT,
      'offset': Type.USHORT
    }), data['count']);

    data['name'] = data['nameRecord'].map(function (record) {
      return util.byteArrayToString(table.readArray(Type.BYTE, record['length'], data['stringOffset'] + record['offset']));
    });

    if (data['format'] === 1) {
      data['langTagCount'] = table.read(Type.USHORT);
      data['langTagRecord'] = table.readArray(util.struct({
        'length': Type.USHORT,
        'offset': Type.USHORT
      }), data['langTagCount']);

      data['langTag'] = table['langTagRecord'].map(function (record) {
        return util.byteArrayToString(table.readArray(Type.BYTE, record['length'], data['stringOffset'] + record['offset']));
      });
    }

    return data;
  };
});
