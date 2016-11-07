var ReadBuffer = require('../readbuffer');
var Type = require('../type');
var util = require('../util');
var common = require('./common');

var gdef = function (buffer, font) {
  var table = new ReadBuffer(buffer);

  var version = table.read(Type.ULONG);
  var glyphClassDef = table.read(Type.OFFSET);
  var data = {};

  if (glyphClassDef !== 0) {
    data.GlyphClassDef = common.ClassDef(table, glyphClassDef);
  }
  return data;
};

module.exports = gdef;
