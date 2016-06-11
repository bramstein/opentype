var ReadBuffer = require('../readbuffer');
var Type = require('../type');
var util = require('../util');

module.exports = function (dataView, font) {
  var table = new ReadBuffer(dataView);

  var data = table.read(util.struct({
    version: Type.FIXED,
    numGlyphs: Type.USHORT
  }));

  if (data.version === 1) {
    util.extend(data, table.read(util.struct({
      maxPoints: Type.USHORT,
      maxContours: Type.USHORT,
      maxCompositePoints: Type.USHORT,
      maxCompositeContours: Type.USHORT,
      maxZones: Type.USHORT,
      maxTwilightPoints: Type.USHORT,
      maxStorage: Type.USHORT,
      maxFunctionDefs: Type.USHORT,
      maxInstructionDefs: Type.USHORT,
      maxStackElements: Type.USHORT,
      maxSizeOfInstructions: Type.USHORT,
      maxComponentElements: Type.USHORT,
      maxComponentDepth: Type.USHORT
    })));
  }

  return data;
};
