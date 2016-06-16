var ReadBuffer = require('../readbuffer');
var Type = require('../type');
var util = require('../util');
var common = require('./common');

var gsub = function (buffer, font) {
  var table = new ReadBuffer(buffer),
      data = {};

  var version = table.read(Type.FIXED);
  var scriptListOffset = table.read(Type.OFFSET);
  var featureListOffset = table.read(Type.OFFSET);
  var lookupListOffset = table.read(Type.OFFSET);

  var scriptList = common.List(table, scriptListOffset, common.Script);
  var featureList = common.List(table, featureListOffset, common.Feature);
  var lookupList = common.LookupList(table, lookupListOffset, gsub.LookupType);

  scriptList.forEach(function (script) {
    var scriptTag = script.tag,
        scriptTable = script.table;

    data[scriptTag] = {};

    scriptTable.forEach(function (language) {
      var languageTag = language.tag,
          languageTable = language.table;

      data[scriptTag][languageTag] = {};

      languageTable['FeatureIndex'].forEach(function (featureIndex) {
        var feature = featureList[featureIndex],
            featureTag = feature.tag,
            featureTable = feature.table;

        data[scriptTag][languageTag][featureTag] = {};

        featureTable['LookupListIndex'].forEach(function (lookupIndex) {
          var lookup = lookupList[lookupIndex];

          lookup['SubTable'].forEach(function (subTable) {
            Object.keys(subTable).forEach(function (glyphId) {
              data[scriptTag][languageTag][featureTag][glyphId] = subTable[glyphId];
            });
          });
        });
      });
    });
  });
  return data;
};

gsub.LookupType = function (buffer, lookupType, offset) {
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
    var coverage = common.Coverage(buffer, offset + coverageOffset);
    for (var i = 0; i < coverage.length; i += 1) {
      data[coverage[i]] = [coverage[i] + deltaGlyphId];
    }
  } else if (lookupType === 1 && format === 2) {
    var coverageOffset = buffer.read(Type.OFFSET);
    var glyphCount = buffer.read(Type.USHORT);
    var substitutes = buffer.readArray(Type.GLYPHID, glyphCount);
    var coverage = common.Coverage(buffer, offset + coverageOffset);

    for (var i = 0; i < coverage.length; i += 1) {
      data[coverage[i]] = [substitutes[i]];
    }
  } else if (lookupType === 2 || lookupType === 3) {
    var coverageOffset = buffer.read(Type.OFFSET);
    var count = buffer.read(Type.USHORT);

    var setOffsets = buffer.readArray(Type.OFFSET, count);
    var coverage = common.Coverage(buffer, offset + coverageOffset);
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
    var coverage = common.Coverage(buffer, offset + coverageOffset);
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
};

module.exports = gsub;
