goog.provide('opentype.tables.os2');

goog.require('opentype.Buffer');
goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Buffer = opentype.Buffer,
      Type = opentype.Type,
      tables = opentype.tables,
      util = opentype.util;

  tables.os2 = function (dataView, font) {
    var table = new Buffer(dataView),
        data = {};

    util.extend(data, table.read(util.struct({
      'version': Type.USHORT,
      'xAvgCharWidth': Type.SHORT,
      'usWeightClass': Type.USHORT,
      'usWidthClass': Type.USHORT,
      'fsType': Type.USHORT,
      'ySubscriptXSize': Type.SHORT,
      'ySubscriptYSize': Type.SHORT,
      'ySubscriptXOffset': Type.SHORT,
      'ySubscriptYOffset': Type.SHORT,
      'ySuperscriptXSize': Type.SHORT,
      'ySuperscriptYSize': Type.SHORT,
      'ySuperscriptXOffset': Type.SHORT,
      'ySuperscriptYOffset': Type.SHORT,
      'yStrikeoutSize': Type.SHORT,
      'yStrikeoutPosition': Type.SHORT,
      'sFamilyClass': Type.SHORT
    })));

    data['panose'] = table.read(util.struct({
      'bFamilyType': Type.BYTE,
      'bSerifStyle': Type.BYTE,
      'bWeight': Type.BYTE,
      'bProportion': Type.BYTE,
      'bContract': Type.BYTE,
      'bStrokeVariation': Type.BYTE,
      'bArmStyle': Type.BYTE,
      'bLetterform': Type.BYTE,
      'bMidline': Type.BYTE,
      'bXHeight': Type.BYTE
    }));

    util.extend(data, table.read(util.struct({
      'ulUnicodeRange1': Type.ULONG,
      'ulUnicodeRange2': Type.ULONG,
      'ulUnicodeRange3': Type.ULONG,
      'ulUnicodeRange4': Type.ULONG,
    })));

    data['achVendID'] = table.readArray(Type.CHAR, 4);

    util.extend(data, table.read(util.struct({
      'fsSelection': Type.USHORT,
      'usFirstCharIndex': Type.USHORT,
      'usLastCharIndex': Type.USHORT,
      'sTypoAscender': Type.SHORT,
      'sTypoDescender': Type.SHORT,
      'sTypoLineGap': Type.SHORT,
      'usWinAscent': Type.USHORT,
      'usWinDescent': Type.USHORT,
    })));

    if (data['version'] >= 1) {
      util.extend(data, table.read(util.struct({
        'ulCodePageRange1': Type.ULONG,
        'ulCodePageRange2': Type.ULONG,
      })));
    }

    if (data['version'] >= 2) {
      util.extend(data, table.read(util.struct({
        'sxHeight': Type.SHORT,
        'sCapHeight': Type.SHORT,
        'usDefaultChar': Type.USHORT,
        'usBreakChar': Type.USHORT,
        'usMaxContext': Type.USHORT
      })));
    }

    return data;
  };
});
