goog.provide('opentype.tables.maxp');

goog.require('opentype.Buffer');
goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Buffer = opentype.Buffer,
      Type = opentype.Type,
      tables = opentype.tables,
      util = opentype.util;

  tables.maxp = function (dataView, font) {
    var table = new Buffer(dataView);

    var data = table.read(util.struct({
      'version': Type.FIXED,
      'numGlyphs': Type.USHORT
    }));

    if (data['version'] === 1) {
      util.extend(data, table.read(util.struct({
        'maxPoints': Type.USHORT,
        'maxContours': Type.USHORT,
        'maxCompositePoints': Type.USHORT,
        'maxCompositeContours': Type.USHORT,
        'maxZones': Type.USHORT,
        'maxTwilightPoints': Type.USHORT,
        'maxStorage': Type.USHORT,
        'maxFunctionDefs': Type.USHORT,
        'maxInstructionDefs': Type.USHORT,
        'maxStackElements': Type.USHORT,
        'maxSizeOfInstructions': Type.USHORT,
        'maxComponentElements': Type.USHORT,
        'maxComponentDepth': Type.USHORT
      })));
    }

    return data;
  };
});
