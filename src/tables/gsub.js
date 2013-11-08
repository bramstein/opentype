goog.provide('opentype.tables.gsub');

goog.require('opentype.Buffer');
goog.require('opentype.Type');
goog.require('opentype.util');
goog.require('opentype.tables.common');

goog.scope(function () {
  var Buffer = opentype.Buffer,
      Type = opentype.Type,
      util = opentype.util,
      tables = opentype.tables,
      common = opentype.tables.common;

  tables.gsub = function (dataView, font) {
    var table = new Buffer(dataView),
        data = {};

    var version = table.read(Type.FIXED);
    var scriptListOffset = table.read(Type.OFFSET);
    var featureListOffset = table.read(Type.OFFSET);
    var lookupListOffset = table.read(Type.OFFSET);

    var scriptList = common.List(table, scriptListOffset, common.Script);
    var featureList = common.List(table, featureListOffset, common.Feature);
    var lookupList = common.LookupList(table, lookupListOffset);

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
});
