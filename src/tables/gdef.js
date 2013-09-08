goog.provide('opentype.tables.gdef');

goog.require('opentype.Buffer');
goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Buffer = opentype.Buffer,
      Type = opentype.Type,
      util = opentype.util,
      tables = opentype.tables;

  tables.gdef = function (dataView, font) {
    var table = new Buffer(dataView);

    var version = table.read(Type.ULONG);
    var glyphClassDef = table.read(Type.OFFSET);
    var data = {};

    if (glyphClassDef !== 0) {
      data['GlyphClassDef'] = tables.gdef.glyphClassDefinitions(table, glyphClassDef);
    }
    return data;
  };

  tables.gdef.glyphClassDefinitions = function (table, offset) {
    table.goto(offset);

    var format = table.read(Type.USHORT);
    var ids = [];

    if (format === 1) {
      var startGlyph = table.read(Type.GLYPHID);
      var glyphCount = table.read(Type.USHORT);
      var classValueArray =  table.readArray(Type.GLYPHID, glyphCount);

      for (var j = 0; j < glyphCount; j += 1) {
        ids[startGlyph + j] = classValueArray[j];
      }
    } else if (format === 2) {
      var classRangeCount = table.read(Type.USHORT);
      var classRangeRecord = table.readArray(util.struct({
        'Start': Type.GLYPHID,
        'End': Type.GLYPHID,
        'Class': Type.USHORT
      }), classRangeCount);

      classRangeRecord.forEach(function (record) {
        var start = record['Start'];
        var end = record['End'];
        var classDefinition = record['Class'];

        for (var j = start; j < end; j += 1) {
          ids[j] = classDefinition;
        }
      });

      return ids;
    }
  };
});
