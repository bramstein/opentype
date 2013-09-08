goog.provide('opentype.woff');

goog.require('opentype.Type');
goog.require('opentype.util');

goog.scope(function () {
  var Type = opentype.Type,
      util = opentype.util,
      woff = opentype.woff;

  /**
   * @type {opentype.Struct}
   */
  woff.TableDirectory = util.struct({
    tag: Type.TAG,
    offset: Type.ULONG,
    compLength: Type.ULONG,
    origLength: Type.ULONG,
    origChecksum: Type.ULONG
  });

  /**
   * @type {opentype.Struct}
   */
  woff.Header = util.struct({
    'signature': Type.ULONG,
    'flavor': Type.ULONG,
    'length': Type.ULONG,
    'numTables': Type.USHORT,
    'reserved': Type.USHORT,
    'totalSfntSize': Type.ULONG,
    'majorVersion': Type.USHORT,
    'minorVersion': Type.USHORT,
    'metaOffset': Type.ULONG,
    'metaLength': Type.ULONG,
    'metaOrigLength': Type.ULONG,
    'privOffset': Type.ULONG,
    'privLength': Type.ULONG
  });
});
