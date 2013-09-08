goog.provide('opentype.sfnt');

goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Type = opentype.Type,
      util = opentype.util,
      sfnt = opentype.sfnt;

  /**
   * @type {opentype.Struct}
   */
  sfnt.Header = util.struct({
    'version': Type.ULONG,
    'numTables': Type.USHORT,
    'searchRange': Type.USHORT,
    'entrySelector': Type.USHORT,
    'rangeShift': Type.USHORT
  });

  /**
   * @type {opentype.Struct}
   */
  sfnt.OffsetTable = util.struct({
    tag: Type.TAG,
    checkSum: Type.ULONG,
    offset: Type.ULONG,
    length: Type.ULONG
  });
});
