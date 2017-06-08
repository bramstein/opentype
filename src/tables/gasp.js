var ReadBuffer = require('../readbuffer');
var Type = require('../type');
var util = require('../util');

module.exports = function (buffer, font) {
  var table = new ReadBuffer(buffer);

  var version = table.read(Type.USHORT);
  var data = {};

  data.gaspRange = table.readArray(util.struct({
    rangeMaxPPEM: Type.USHORT,
    rangeGaspBehavior: Type.USHORT
  }), table.read(Type.USHORT));

  return data;
};
