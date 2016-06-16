var Type = require('./type');
var util = require('./util');

var Header = util.struct({
  version: Type.ULONG,
  numTables: Type.USHORT,
  searchRange: Type.USHORT,
  entrySelector: Type.USHORT,
  rangeShift: Type.USHORT
});

var OffsetTable = util.struct({
  tag: Type.TAG,
  checkSum: Type.ULONG,
  offset: Type.ULONG,
  length: Type.ULONG
});

module.exports = {
  OffsetTable: OffsetTable,
  Header: Header
};
