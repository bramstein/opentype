var iconv = require('iconv-lite');

/**
 * @constructor
 * @param {Buffer} buffer
 * @param {number=} opt_byteOffset
 */
var ReadBuffer = function (buffer, opt_byteOffset) {
  this.buffer = buffer;
  this.byteOffset = opt_byteOffset || 0;
};

/**
 * Jump to an offset in this buffer
 * @param {number} byteOffset
 */
ReadBuffer.prototype.goto = function (byteOffset) {
  this.byteOffset = byteOffset;
};

/**
 * Read a struct from the buffer at the next
 * position or if byteOffset is given a specific
 * position.
 *
 * @param {opentype.Struct} type
 * @param {number=} opt_byteOffset
 * @return {?}
 */
ReadBuffer.prototype.read = function (type, opt_byteOffset) {
  var data = type.read(this.buffer, opt_byteOffset || this.byteOffset);

  if (opt_byteOffset === undefined) {
    this.byteOffset += type.sizeof;
  }

  return data;
};

/**
 * Read multiple structs from the buffer at the
 * next position or if byteOffset is given a
 * specific position.
 *
 * @param {opentype.Struct} type
 * @param {number} count
 * @param {number=} opt_byteOffset
 * @return {Array.<?>}
 */
ReadBuffer.prototype.readArray = function (type, count, opt_byteOffset) {
  var byteOffset = opt_byteOffset || this.byteOffset,
      data = [];

  for (var i = 0; i < count; i += 1) {
    data.push(type.read(this.buffer, byteOffset));
    byteOffset += type.sizeof;
  }

  if (opt_byteOffset === undefined) {
    this.byteOffset += type.sizeof * count;
  }

  return data;
};

ReadBuffer.prototype.readString = function (encoding, length, opt_byteOffset) {
  var byteOffset = opt_byteOffset || this.byteOffset;

  var result = iconv.decode(this.buffer.slice(byteOffset, byteOffset + length), encoding);

  this.byteOffset += length;

  return result;
};

module.exports = ReadBuffer;
