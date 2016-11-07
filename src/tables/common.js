var Type = require('../type');
var util = require('../util');

var List = function (buffer, offset, table) {
  buffer.goto(offset);

  var data = [];
  var count = buffer.read(Type.USHORT);

  var records = buffer.readArray(util.struct({
    tag: Type.TAG,
    offset: Type.OFFSET
  }), count);

  for (var i = 0; i < count; i += 1) {
    data.push({
      tag: records[i].tag,
      table: table(buffer, offset + records[i].offset)
    });
  }

  return data;
};

var ClassDef = function (buffer, offset) {
  buffer.goto(offset);

  var format = buffer.read(Type.USHORT);
  var data = {};

  if (format === 1) {
    var startGlyph = buffer.read(Type.GLYPHID);
    var classValues = buffer.readArray(Type.USHORT, buffer.read(Type.USHORT));

    for (var i = startGlyph, j= 0; i < (startGlyph + classValues.length); i++, j++) {
      data[i] = classValues[j];
    }
  } else if (format === 2) {
    var classRangeRecords = buffer.readArray(util.struct({
      Start: Type.GLYPHID,
      End: Type.GLYPHID,
      Class: Type.USHORT
    }), buffer.read(Type.USHORT));

    classRangeRecords.forEach(function (record) {
      for (var i = record.Start; i <= record.End; i++) {
        data[i] = record.Class;
      }
    });
  }

  return data;
};

var Script = function (buffer, offset) {
  buffer.goto(offset);

  var data = [];

  var defaultLangSys = buffer.read(Type.OFFSET);
  var langSysCount = buffer.read(Type.USHORT);

  var records = buffer.readArray(util.struct({
    tag: Type.TAG,
    offset: Type.OFFSET
  }), langSysCount);

  if (defaultLangSys) {
    data.push({
      tag: 'DFLT',
      table: LangSys(buffer, offset + defaultLangSys)
    });
  }

  for (var i = 0; i < records.length; i += 1) {
    data.push({
      tag: records[i].tag,
      table: LangSys(buffer, offset + records[i].offset)
    });
  }

  return data;
};

var LangSys = function (buffer, offset) {
  buffer.goto(offset);

  var lookupOrder = buffer.read(Type.OFFSET);
  var reqFeatureIndex = buffer.read(Type.USHORT);
  var featureCount = buffer.read(Type.USHORT);
  var featureIndex = buffer.readArray(Type.USHORT, featureCount);

  return {
    'LookupOrder': lookupOrder,
    'ReqFeatureIndex': reqFeatureIndex,
    'FeatureCount': featureCount,
    'FeatureIndex': featureIndex
  };
};

var Feature = function (buffer, offset) {
  buffer.goto(offset);

  var featureParams = buffer.read(Type.OFFSET);
  var lookupCount = buffer.read(Type.USHORT);
  var lookupListIndex = buffer.readArray(Type.USHORT, lookupCount);

  return {
    'FeatureParams': featureParams,
    'LookupCount': lookupCount,
    'LookupListIndex': lookupListIndex
  };
};

var LookupList = function (buffer, offset, table) {
  buffer.goto(offset);

  var data = [];
  var count = buffer.read(Type.USHORT);
  var records = buffer.readArray(Type.OFFSET, count);

  for (var i = 0; i < count; i += 1) {
    data.push(Lookup(buffer, offset + records[i], table));
  }

  return data;
};

var Lookup = function (buffer, offset, table) {
  buffer.goto(offset);

  var data = {};

  var lookupType = buffer.read(Type.USHORT);
  var lookupFlag = buffer.read(Type.USHORT);
  var subTableCount = buffer.read(Type.USHORT);
  var subTables = buffer.readArray(Type.OFFSET, subTableCount);
  var markFilteringSet = buffer.read(Type.USHORT);

  for (var i = 0; i < subTableCount; i += 1) {
     subTables[i] = table(buffer, lookupType, offset + subTables[i]);
  }

  return {
    'LookupType': lookupType,
    'LookupFlag': lookupFlag,
    'SubTable': subTables,
    'MarkFilteringSet': markFilteringSet
  };
};

var Coverage = function (buffer, offset) {
  buffer.goto(offset);

  var format = buffer.read(Type.USHORT);
  var count = buffer.read(Type.USHORT);
  var data = [];

  if (format === 1) {
    data = buffer.readArray(Type.GLYPHID, count);
  } else if (format === 2) {
    var records = buffer.readArray(util.struct({
      start: Type.GLYPHID,
      end: Type.GLYPHID,
      startCoverageIndex: Type.USHORT
    }), count);

    for (var i = 0; i < count; i += 1) {
      for(var glyph = records[i].start; glyph <= records[i].end; glyph += 1) {
        data.push(records[i].startCoverageIndex + glyph - records[i].start);
      }
    }
  }
  return data;
};

module.exports = {
  List: List,
  Script: Script,
  LangSys: LangSys,
  Feature: Feature,
  LookupList: LookupList,
  Lookup: Lookup,
  Coverage: Coverage,
  ClassDef: ClassDef
};
