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

      languageTable.FeatureIndex.forEach(function (featureIndex) {
        var feature = featureList[featureIndex],
            featureTag = feature.tag,
            featureTable = feature.table;

        data[scriptTag][languageTag][featureTag] = {};

        featureTable.LookupListIndex.forEach(function (lookupIndex) {
          var lookup = lookupList[lookupIndex];
          var type = gsub.LookupTypes[lookup.LookupType];

          data[scriptTag][languageTag][featureTag][type] = {};

          lookup.SubTable.forEach(function (subTable) {
            Object.keys(subTable).forEach(function (glyphId) {
              data[scriptTag][languageTag][featureTag][type][glyphId] = subTable[glyphId];
            });
          });
        });
      });
    });
  });
  return data;
};

gsub.LookupTypes = {
  1: 'single',
  2: 'multiple',
  3: 'alternate',
  4: 'ligature',
  5: 'contextual',
  6: 'chaining',
  7: 'extension',
  8: 'reverse'
};

gsub.SubstLookupRecord = util.struct({
  SequenceIndex: Type.USHORT,
  LookupListIndex: Type.USHORT
});

gsub.LookupType = function (buffer, lookupType, offset) {
  buffer.goto(offset);

  var format = buffer.read(Type.USHORT);
  var data = {};

  /**
   * substitution: {
   *   single: {
   *     "A": "A-caret"
   *   },
   *   multiple: {
   *     "A": ["A-caret", "A-long"]
   *   },
   *   alternate: {
   *     "A": ["A-single", "A-multi"]
   *   },
   *   ligature: {
   *     "f": [
   *      { components: ["i"], ligature: "fi" },
   *      { components: ["f"], ligature: "ff" },
   *      { components: ["f", "i"], ligature: "ffi" },
   *      { components: ["f", "l"], ligature: "ffl" },
   *      { components: ["l"], ligature: "fl" }
   *     ],
   *     "e": [
   *       ...
   *     ]
   *   },
   *   contextual: {
   *     "f"
   *   }
   * }
   */

  if (lookupType === 1 && format === 1) {
    var coverageOffset = buffer.read(Type.OFFSET);
    var deltaGlyphId = buffer.read(Type.SHORT);
    var coverage = common.Coverage(buffer, offset + coverageOffset);
    for (var i = 0; i < coverage.length; i += 1) {
      data[coverage[i]] = coverage[i] + deltaGlyphId;
    }
  } else if (lookupType === 1 && format === 2) {
    var coverageOffset = buffer.read(Type.OFFSET);
    var glyphCount = buffer.read(Type.USHORT);
    var substitutes = buffer.readArray(Type.GLYPHID, glyphCount);
    var coverage = common.Coverage(buffer, offset + coverageOffset);

    for (var i = 0; i < coverage.length; i += 1) {
      data[coverage[i]] = substitutes[i];
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
        data[coverage[i]] = sets[i];
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
          ligature: ligGlyph,
          components: components
        });
      }
      ligatureSet.push(ligature);
    }

    for (var i = 0; i < coverage.length; i += 1) {
      data[coverage[i]] = ligatureSet[i];
    }
  } else if (lookupType === 5 && format === 1) {
    var coverageOffset = buffer.read(Type.OFFSET);
    var subRuleSetCount = buffer.read(Type.USHORT);
    var subRuleSetOffsets = buffer.readArray(Type.OFFSET, subRuleSetCount);

    var coverage = common.Coverage(buffer, offset + coverageOffset);

    subRuleSetOffsets.forEach(function (subRuleSetOffset) {
      buffer.goto(offset + subRuleSetOffset);
      var subRuleCount = buffer.read(Type.USHORT);
      var subRuleOffsets = buffer.readArray(Type.OFFSET, subRuleCount);

      subRuleOffsets.forEach(function (subRuleOffset) {
        buffer.goto(offset + subRuleSetOffset + subRuleOffset);

        var glyphCount = buffer.read(Type.USHORT);
        var substCount = buffer.read(Type.USHORT);
        var input = buffer.readArray(Type.GLYPHID, glyphCount - 1);
        var records = buffer.readArray(gsub.SubstLookupRecord, substCount);

        for (var i = 0; i < coverage.length; i++) {
          if (!data[coverage[i]]) {
            data[coverage[i]] = [];
          }

          data[coverage[i]].push({
            input: input,
            records: records
          });
        }
      });
    });
  } else if (lookupType === 5 && format === 2) {
    var coverageOffset = buffer.read(Type.OFFSET);
    var classDefOffset = buffer.read(Type.OFFSET);
    var subClassSetCount = buffer.read(Type.USHORT);
    var subClassSetOffsets = buffer.readArray(Type.OFFSET, subClassSetCount);

    var coverage = common.Coverage(buffer, offset + coverageOffset);
    var classDef = common.ClassDef(buffer, offset + classDefOffset);

    subClassSetOffsets.forEach(function (subClassSetOffset) {
      buffer.goto(offset + subClassSetOffset);

      var subClassRuleCount = buffer.read(Type.USHORT);
      var subClassRuleOffsets = buffer.readArray(Type.OFFSET, subClassRuleCount);

      subClassRuleOffsets.forEach(function (subClassRuleOffset) {
        buffer.goto(offset + subClassSetOffset + subClassRuleOffset);

        var glyphCount = buffer.read(Type.USHORT);
        var substCount = buffer.read(Type.USHORT);
        var classes = buffer.readArray(Type.USHORT, glyphCount - 1);
        var records = buffer.readArray(gsub.SubstLookupRecord, substCount);
      });
    });
  } else if (lookupType === 5 && format === 3) {
    var glyphCount = buffer.read(Type.USHORT);
    var substCount = buffer.read(Type.USHORT);
    var coverageOffsets = buffer.readArray(Type.OFFSET, glyphCount);
    var records = buffer.readArray(gsub.SubstLookupRecord, substCount);

    coverageOffsets.forEach(function (coverageOffset) {
      coverage = common.Coverage(buffer, offset + coverageOffset);
    });
  } else if (lookupType === 6 && format === 1) {
  } else if (lookupType === 6 && format === 2) {
  } else if (lookupType === 6 && format === 3) {
  } else if (lookupType === 7) {
    var extensionLookupType = buffer.read(Type.USHORT);
    var extensionOffset = buffer.read(Type.ULONG);
    data = gsub.LookupType(buffer, extensionLookupType, extensionOffset);
  } else if (lookupType === 8 && format === 1) {
    var coverageOffset = buffer.read(Type.OFFSET);
    var backtrackGlyphCount = buffer.read(Type.USHORT);
    var backtrackCoverageOffsets = buffer.readArray(Type.OFFSET, backtrackGlyphCount);
    var lookaheadGlyphCount = buffer.read(Type.USHORT);
    var lookaheadCoverageOffsets = buffer.readArray(Type.OFFSET, lookaheadGlyphCount);
    var glyphCount = buffer.read(Type.USHORT);
    var substitutes = buffer.readArray(Type.GLYPHID, glyphCount);
  }
  return data;
};

module.exports = gsub;
