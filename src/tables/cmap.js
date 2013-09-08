goog.provide('opentype.tables.cmap');

goog.require('opentype.Buffer');
goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Buffer = opentype.Buffer,
      Type = opentype.Type,
      util = opentype.util,
      tables = opentype.tables;

  tables.cmap = function (dataView, font) {
    var table = new Buffer(dataView),
        data = {
          'tables': {}
        };

    data['header'] = table.read(util.struct({
      'version': Type.USHORT,
      'numTables': Type.USHORT
    }));

    data['index'] = table.readArray(util.struct({
      platformID: Type.USHORT,
      encodingID: Type.USHORT,
      offset: Type.ULONG
    }), data['header']['numTables']);

    data['charCode'] = {};
    data['glyph'] = [];

    data['index'].forEach(function (subTable) {
      var subData = {};

      table.goto(subTable.offset);

      var format = table.read(Type.USHORT, subTable.offset);

      // For now we support the same formats as OTS, which
      // only supports 0, 4, 12, 13, and (14).
      if (format === 0) {
        subData = table.read(util.struct({
          'format': Type.USHORT,
          'length': Type.USHORT,
          'language': Type.USHORT
        }));

        subData['glyphIdArray'] = table.readArray(Type.BYTE, 256);

        subData['glyphIdArray'].forEach(function (id) {
          data['charCode'][id] = id;
          data['glyph'][id] = id;
        });
      } else if (format === 4) {
        subData = table.read(util.struct({
          'format': Type.USHORT,
          'length': Type.USHORT,
          'language': Type.USHORT,
          'segCountX2': Type.USHORT,
          'searchRange': Type.USHORT,
          'entrySelector': Type.USHORT,
          'rangeShift': Type.USHORT
        }));

        var segCount = subData['segCountX2'] / 2;

        subData['endCount'] = table.readArray(Type.USHORT, segCount);
        subData['reservedPad'] = table.read(Type.USHORT);
        subData['startCount'] = table.readArray(Type.USHORT, segCount);
        subData['idDelta'] = table.readArray(Type.SHORT, segCount);

        var idRangeTableOffset = table.byteOffset;

        subData['idRangeOffset'] = table.readArray(Type.USHORT, segCount);
        subData['glyphIdArray'] = [];

        for (var i = 0; i < segCount; i += 1) {
          var start = subData['startCount'][i];
          var end = subData['endCount'][i];
          var delta = subData['idDelta'][i];
          var rangeOffset = subData['idRangeOffset'][i];
          var idRangeOffset = idRangeTableOffset + (i * Type.USHORT.sizeof);

          for (var j = start; j < end; j += 1) {
            var charCode = j,
                id = null;

            if (rangeOffset === 0) {
              id = (charCode + delta) % 65536;
            } else {
              id = (table.read(Type.USHORT, idRangeOffset + rangeOffset + (charCode - start) * Type.USHORT.sizeof) + delta) % 65536;
            }

            data['charCode'][charCode] = id;
            data['glyph'][id] = charCode;
          }
        }
      } else if (format === 12 ||format === 13) {
        subData = table.read(util.struct({
          'format': Type.USHORT,
          'reserved': Type.USHORT,
          'length': Type.USHORT,
          'nGroups': Type.USHORT
        }));

        subData['groups'] = table.readArray(util.struct({
          'startCharCode': Type.ULONG,
          'endCharCode': Type.ULONG,
          'glyphID': Type.ULONG
        }), subData['nGroups']);

        for (var i = 0; i < subData['nGroups']; i += 1) {
          var start = subData['groups'][i]['startCharCode'];
          var end = subData['groups'][i]['endCharCode'];

          for (var j = start; j < end; j += 1) {
            var charCode = j,
                id = null;

            if (format === 12) {
              id = subData['groups'][i]['glyphId'] + j;
            } else if (format === 13) {
              id = subData['groups'][i]['glyphId'];
            }

            data['charCode'][charCode] = id;
            data['glyph'][id] = charCode;
          }
        }
      }
      // TODO: Add format 14

      data['tables'][format] = subData;
    });

    return data;
  };
});
