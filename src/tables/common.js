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

    LookupList: function (buffer, offset) {
      buffer.goto(offset);

      var data = [];
      var count = buffer.read(Type.USHORT);
      var records = buffer.readArray(Type.OFFSET, count);

      for (var i = 0; i < count; i += 1) {
        data.push(tables.common.Lookup(buffer, offset + records[i]));
      }

      return data;
    },

    Lookup: function (buffer, offset) {
      buffer.goto(offset);

      var data = {};

      var lookupType = buffer.read(Type.USHORT);
      var lookupFlag = buffer.read(Type.USHORT);
      var subTableCount = buffer.read(Type.USHORT);
      var subTables = buffer.readArray(Type.OFFSET, subTableCount);
      var markFilteringSet = buffer.read(Type.USHORT);

      for (var i = 0; i < subTableCount; i += 1) {
         subTables[i] = tables.common.LookupType(buffer, lookupType, offset + subTables[i]);
      }

      return {
        'LookupType': lookupType,
        'LookupFlag': lookupFlag,
        'SubTable': subTables,
        'MarkFilteringSet': markFilteringSet
      };
    },

    LookupType: function (buffer, lookupType, offset) {
      buffer.goto(offset);

      var format = buffer.read(Type.USHORT);
      var data = {};

      /**
       * Single:
       *
       * <GlyphId>: [<GlyphId>]
       *
       * Multiple:
       *
       * <GlyphId>: [<GlyphId>, ...]
       *
       * Alternate:
       *
       * <GlyphId>: [[<GlyphId>, ...]]
       *
       * Ligature:
       *
       * <GlyphId>: {
       *  <GlyphId>: <GlyphId>,
       *  <GlyphId>: {
       *    <GlyphId>: <GlyphId>
       *  }
       * }
       */
      if (lookupType === 1 && format === 1) {
        var coverageOffset = buffer.read(Type.OFFSET);
        var deltaGlyphId = buffer.read(Type.SHORT);
        var coverage = tables.common.Coverage(buffer, offset + coverageOffset);
        for (var i = 0; i < coverage.length; i += 1) {
          data[coverage[i]] = [coverage[i] + deltaGlyphId];
        }
      } else if (lookupType === 1 && format === 2) {
        var coverageOffset = buffer.read(Type.OFFSET);
        var glyphCount = buffer.read(Type.USHORT);
        var substitutes = buffer.readArray(Type.GLYPHID, glyphCount);
        var coverage = tables.common.Coverage(buffer, offset + coverageOffset);

        for (var i = 0; i < coverage.length; i += 1) {
          data[coverage[i]] = [substitutes[i]];
        }
      } else if (lookupType === 2 || lookupType === 3) {
        var coverageOffset = buffer.read(Type.OFFSET);
        var count = buffer.read(Type.USHORT);

        var setOffsets = buffer.readArray(Type.OFFSET, count);
        var coverage = tables.common.Coverage(buffer, offset + coverageOffset);
        var sets = [];

        for (var i = 0; i < count; i += 1) {
          buffer.goto(offset + setOffsets[i]);
          var glyphCount = buffer.read(Type.USHORT);
          sets.push(buffer.readArray(Type.GLYPHID, glyphCount));
        }

        for (var i = 0; i < coverage.length; i += 1) {
          if (lookupType === 2) {
            data[coverage[i]] = [sets[i]];
          } else {
            data[coverage[i]] = sets[i];
          }
        }
      } else if (lookupType === 4) {
        var coverageOffset = buffer.read(Type.OFFSET);
        var count = buffer.read(Type.USHORT);

        var setOffsets = buffer.readArray(Type.OFFSET, count);
        var coverage = tables.common.Coverage(buffer, offset + coverageOffset);
        var ligatureSetOffsets = [];

        for (var i = 0; i < count; i += 1) {
          buffer.goto(offset + setOffsets[i]);
          var ligatureCount = buffer.read(Type.USHORT);
          ligatureSetOffsets.push(buffer.readArray(Type.OFFSET, ligatureCount));

        }


        var ligatureSet = [];

        for (var i = 0; i < setOffsets.length; i += 1) {
          var ligature = [];

          for (var j = 0; j < ligatureSetOffsets[i].length; j += 1) {
            buffer.goto(offset + setOffsets[i] + ligatureSetOffsets[i][j]);
            var ligGlyph = buffer.read(Type.GLYPHID);
            var components = buffer.readArray(Type.GLYPHID, buffer.read(Type.USHORT) - 1);

            ligature.push({
              ligGlyph: ligGlyph,
              components: components
            });
          }
          ligatureSet.push(ligature);
        }

        for (var i = 0; i < coverage.length; i += 1) {
          var ligatures = ligatureSet[i];
          data[coverage[i]] = {};

          for (var j = 0; j < ligatures.length; j += 1) {
            var components = ligatures[j].components,
                ligature = ligatures[j].ligGlyph;

            var current = data[coverage[i]];

            for (var k = 0; k < components.length; k += 1) {
              if (k < components.length - 1) {
                current[components[k]] = {};
                current = current[components[k]];
              } else {
                current[components[k]] = ligature;
              }
            }
          }
        }
      }
      return data;
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
