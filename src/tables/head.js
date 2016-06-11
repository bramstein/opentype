var Buffer = require('../buffer');
var Type = require('../type');
var util = require('../util');

module.exports = function (dataView, font) {
  var table = new Buffer(dataView);

  return table.read(util.struct({
    version: Type.FIXED,
    fontRevision: Type.FIXED,
    checkSumAdjustment: Type.ULONG,
    magicNumber: Type.ULONG,
    flags: Type.USHORT,
    unitsPerEm: Type.USHORT,
    created: Type.LONGDATETIME,
    modified: Type.LONGDATETIME,
    xMin: Type.SHORT,
    yMin: Type.SHORT,
    xMax: Type.SHORT,
    yMax: Type.SHORT,
    macStyle: Type.USHORT,
    lowestRecPPEM: Type.USHORT,
    fontDirectionHint: Type.SHORT,
    indexToLocFormat: Type.SHORT,
    glyphDataFormat: Type.SHORT
  }));
};
