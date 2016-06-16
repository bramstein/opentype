var Type = require('./type');
var util = require('./util');

var TableDirectory = util.struct({
  tag: Type.TAG,
  offset: Type.ULONG,
  compLength: Type.ULONG,
  origLength: Type.ULONG,
  origChecksum: Type.ULONG
});

var Header = util.struct({
  signature: Type.ULONG,
  flavor: Type.ULONG,
  length: Type.ULONG,
  numTables: Type.USHORT,
  reserved: Type.USHORT,
  totalSfntSize: Type.ULONG,
  majorVersion: Type.USHORT,
  minorVersion: Type.USHORT,
  metaOffset: Type.ULONG,
  metaLength: Type.ULONG,
  metaOrigLength: Type.ULONG,
  privOffset: Type.ULONG,
  privLength: Type.ULONG
});

module.exports = {
  Header: Header,
  TableDirectory: TableDirectory
};
