var ReadBuffer = require('../readbuffer');
var Type = require('../type');
var util = require('../util');

var cmap = function (buffer, font) {
  var table = new ReadBuffer(buffer),
      data = [];

  var header = table.read(util.struct({
    version: Type.USHORT,
    numTables: Type.USHORT
  }));

  var index = table.readArray(util.struct({
    platformID: Type.USHORT,
    encodingID: Type.USHORT,
    offset: Type.ULONG
  }), header.numTables);

  index.forEach(function (subTable) {
    var subData = {};
    var charCodes = {};
    var language = 0;

    table.goto(subTable.offset);

    var format = table.read(Type.USHORT, subTable.offset);

    // For now we support the same formats as OTS, which
    // only supports 0, 4, 12, 13, and 14.
    if (format === 0) {
      subData = table.read(util.struct({
        format: Type.USHORT,
        length: Type.USHORT,
        language: Type.USHORT
      }));

      var glyphIdArray = table.readArray(Type.BYTE, 256);

      for (var i = 0; i < 256; i++) {
        charCodes[i] = glyphIdArray[i];
      }

      language = subData.language;
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

      for (var i = 0; i < segCount - 1; i += 1) {
        var start = startCount[i];
        var end = endCount[i];
        var delta = idDelta[i];
        var rangeOffset = idRangeOffset[i];
        var offset = idRangeTableOffset + (i * Type.USHORT.sizeof);

        for (var j = start; j <= end; j += 1) {
          var charCode = j,
              id = null;

          if (rangeOffset === 0) {
            id = (charCode + delta) % 0xFFFF;
          } else {
            id = (table.read(Type.USHORT, offset + rangeOffset + (charCode - start) * Type.USHORT.sizeof) + delta) % 0xFFFF;
          }

          charCodes[charCode] = id;
        }
      }

      language = subData.language;
    } else if (format === 12) {
      subData = table.read(util.struct({
        format: Type.USHORT,
        reserved: Type.USHORT,
        length: Type.ULONG,
        language: Type.ULONG,
        nGroups: Type.ULONG
      }));

      var groups = table.readArray(util.struct({
        startCharCode: Type.ULONG,
        endCharCode: Type.ULONG,
        glyphID: Type.ULONG
      }), subData.nGroups);

      for (var i = 0; i < subData.nGroups; i += 1) {
        var start = groups[i].startCharCode;
        var end = groups[i].endCharCode;

        for (var charCode = start, id = groups[i].glyphID; charCode <= end; charCode += 1, id++) {
          charCodes[charCode] = id;
        }
      }

      language = subData.language;

    } else if (format === 13) {
      subData = table.read(util.struct({
        format: Type.USHORT,
        reserved: Type.USHORT,
        length: Type.ULONG,
        language: Type.ULONG,
        nGroups: Type.ULONG
      }));

      var groups = table.readArray(util.struct({
        startCharCode: Type.ULONG,
        endCharCode: Type.ULONG,
        glyphID: Type.ULONG
      }), subData.nGroups);

      for (var i = 0; i < subData.nGroups; i += 1) {
        var start = groups[i].startCharCode;
        var end = groups[i].endCharCode;

        for (var j = start; j <= end; j += 1) {
          var charCode = j,
              id = groups[i].glyphID;

          charCodes[charCode] = id;
        }
      }

      language = subData.language;
    } else if (format === 14) {
      subData = table.read(util.struct({
        format: Type.USHORT,
        length: Type.ULONG,
        numVarSelectorRecords: Type.ULONG
      }));


      var records = table.readArray(util.struct({
        varSelector: Type.UINT24,
        defaultUVSOffset: Type.ULONG,
        nonDefaultUVSOffset: Type.ULONG
      }), subData.numVarSelectorRecords);

      records.forEach(function (record) {
        if (record.defaultUVSOffset !== 0) {
          table.goto(record.defaultUVSOffset);

          var ranges = table.readArray(util.struct({
            startUnicodeValue: Type.UINT24,
            additionalCount: Type.BYTE
          }), table.read(Type.ULONG));
        }

        if (record.nonDefaultUVSOffset !== 0) {
          table.goto(record.nonDefaultUVSOffset);

          var ranges = table.readArray(util.struct({
            unicodeValue: Type.UINT24,
            glyphID: Type.BYTE
          }), table.read(Type.ULONG));
        }
      });

      language = 0;
    }

    data.push({
      format: format,
      platformID: subTable.platformID,
      encodingID: subTable.encodingID,
      language: language,
      charCodes: charCodes
    });
  });

  return data;
};

module.exports = cmap;
