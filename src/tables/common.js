goog.provide('opentype.tables.common');

goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Type = opentype.Type,
      util = opentype.util,
      tables = opentype.tables;

  tables.common = {

    List: function (buffer, offset, table) {
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
    },

    Script: function (buffer, offset) {
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
          table: tables.common.LangSys(buffer, offset + defaultLangSys)
        });
      }

      for (var i = 0; i < records.length; i += 1) {
        data.push({
          tag: records[i].tag,
          table: tables.common.LangSys(buffer, offset + records[i].offset)
        });
      }

      return data;
    },

    LangSys: function (buffer, offset) {
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
    },

    Feature: function (buffer, offset) {
      buffer.goto(offset);

      var featureParams = buffer.read(Type.OFFSET);
      var lookupCount = buffer.read(Type.USHORT);
      var lookupListIndex = buffer.readArray(Type.USHORT, lookupCount);

      return {
        'FeatureParams': featureParams,
        'LookupCount': lookupCount,
        'LookupListIndex': lookupListIndex
      };
    },

    LookupList: function (buffer, offset, table) {
      buffer.goto(offset);

      var data = [];
      var count = buffer.read(Type.USHORT);
      var records = buffer.readArray(Type.OFFSET, count);

      for (var i = 0; i < count; i += 1) {
        data.push(tables.common.Lookup(buffer, offset + records[i], table));
      }

      return data;
    },

    Lookup: function (buffer, offset, table) {
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
    },

    Coverage: function (buffer, offset) {
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
          for(var j = records[i].start; j < records[i].end; j += 1) {
            data.push(j);
          }
        }
      }
      return data;
    }
  };
});
