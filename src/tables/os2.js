var ReadBuffer = require('../readbuffer');
var Type = require('../type');
var util = require('../util');

module.exports = function (buffer, font) {
  var table = new ReadBuffer(buffer),
      data = {};

  util.extend(data, table.read(util.struct({
    version: Type.USHORT,
    xAvgCharWidth: Type.SHORT,
    usWeightClass: Type.USHORT,
    usWidthClass: Type.USHORT,
    fsType: Type.USHORT,
    ySubscriptXSize: Type.SHORT,
    ySubscriptYSize: Type.SHORT,
    ySubscriptXOffset: Type.SHORT,
    ySubscriptYOffset: Type.SHORT,
    ySuperscriptXSize: Type.SHORT,
    ySuperscriptYSize: Type.SHORT,
    ySuperscriptXOffset: Type.SHORT,
    ySuperscriptYOffset: Type.SHORT,
    yStrikeoutSize: Type.SHORT,
    yStrikeoutPosition: Type.SHORT,
    sFamilyClass: Type.SHORT
  })));

  data.panose = table.read(util.struct({
    bFamilyType: Type.BYTE,
    bSerifStyle: Type.BYTE,
    bWeight: Type.BYTE,
    bProportion: Type.BYTE,
    bContrast: Type.BYTE,
    bStrokeVariation: Type.BYTE,
    bArmStyle: Type.BYTE,
    bLetterform: Type.BYTE,
    bMidline: Type.BYTE,
    bXHeight: Type.BYTE
  }));

  util.extend(data, table.read(util.struct({
    ulUnicodeRange1: Type.ULONG,
    ulUnicodeRange2: Type.ULONG,
    ulUnicodeRange3: Type.ULONG,
    ulUnicodeRange4: Type.ULONG,
  })));

  data.achVendID = table.read(Type.TAG);

  util.extend(data, table.read(util.struct({
    fsSelection: Type.USHORT,
    usFirstCharIndex: Type.USHORT,
    usLastCharIndex: Type.USHORT,
    sTypoAscender: Type.SHORT,
    sTypoDescender: Type.SHORT,
    sTypoLineGap: Type.SHORT,
    usWinAscent: Type.USHORT,
    usWinDescent: Type.USHORT,
  })));

  if (data.version >= 1) {
    util.extend(data, table.read(util.struct({
      ulCodePageRange1: Type.ULONG,
      ulCodePageRange2: Type.ULONG,
    })));
  }

  if (data.version >= 2) {
    util.extend(data, table.read(util.struct({
      sxHeight: Type.SHORT,
      sCapHeight: Type.SHORT,
      usDefaultChar: Type.USHORT,
      usBreakChar: Type.USHORT,
      usMaxContext: Type.USHORT
    })));
  }

  if (data.version >= 5) {
    util.extend(data, table.read(util.struct({
      usLowerOpticalPointSize: Type.USHORT,
      usUpperOpticalPointSize: Type.USHORT
    })));
  }

  return data;
};
