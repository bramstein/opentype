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
        data = {};

    var header = table.read(util.struct({
      version: Type.USHORT,
      numTables: Type.USHORT
    }));

    var index = table.readArray(util.struct({
      platformID: Type.USHORT,
      encodingID: Type.USHORT,
      offset: Type.ULONG
    }), header.numTables);

    data['charCode'] = {};
    data['glyph'] = [];

    index.forEach(function (subTable) {
      var subData = {};

      table.goto(subTable.offset);

      var format = table.read(Type.USHORT, subTable.offset);

      // For now we support the same formats as OTS, which
      // only supports 0, 4, 12, 13, and (14).
      if (format === 0) {
        subData = table.read(util.struct({
          format: Type.USHORT,
          length: Type.USHORT,
          language: Type.USHORT
        }));

        var glyphIdArray = table.readArray(Type.BYTE, 256);

        glyphIdArray.forEach(function (id) {
          data['charCode'][id] = id;
          data['glyph'][id] = id;
        });
      } else if (format === 4) {
        subData = table.read(util.struct({
          format: Type.USHORT,
          length: Type.USHORT,
          language: Type.USHORT,
          segCountX2: Type.USHORT,
          searchRange: Type.USHORT,
          entrySelector: Type.USHORT,
          rangeShift: Type.USHORT
        }));

        var segCount = subData.segCountX2 / 2;

        var endCount = table.readArray(Type.USHORT, segCount);
        var reservedPad = table.read(Type.USHORT);
        var startCount = table.readArray(Type.USHORT, segCount);
        var idDelta = table.readArray(Type.SHORT, segCount);

        var idRangeTableOffset = table.byteOffset;

        var idRangeOffset = table.readArray(Type.USHORT, segCount);
        var glyphIdArray = [];

        for (var i = 0; i < segCount; i += 1) {
          var start = startCount[i];
          var end = endCount[i];
          var delta = idDelta[i];
          var rangeOffset = idRangeOffset[i];
          var offset = idRangeTableOffset + (i * Type.USHORT.sizeof);

          for (var j = start; j < end; j += 1) {
            var charCode = j,
                id = null;

            if (rangeOffset === 0) {
              id = (charCode + delta) % 65536;
            } else {
              id = (table.read(Type.USHORT, offset + rangeOffset + (charCode - start) * Type.USHORT.sizeof) + delta) % 65536;
            }

            data['charCode'][charCode] = id;
            data['glyph'][id] = charCode;
          }
        }
      } else if (format === 12 ||format === 13) {
        subData = table.read(util.struct({
          format: Type.USHORT,
          reserved: Type.USHORT,
          length: Type.USHORT,
          nGroups: Type.USHORT
        }));

        var groups = table.readArray(util.struct({
          startCharCode: Type.ULONG,
          endCharCode: Type.ULONG,
          glyphID: Type.ULONG
        }), subData.nGroups);

        for (var i = 0; i < subData.nGroups; i += 1) {
          var start = groups[i].startCharCode;
          var end = groups[i].endCharCode;

          for (var j = start; j < end; j += 1) {
            var charCode = j,
                id = null;

            if (format === 12) {
              id = groups[i].glyphID + j;
            } else if (format === 13) {
              id = groups[i].glyphID;
            }

            data['charCode'][charCode] = id;
            data['glyph'][id] = charCode;
          }
        }
      }
      // TODO: Add format 14
    });

    return data;
  };
});
