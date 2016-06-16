var Int64 = require('node-int64')

/**
 * @enum {Struct}
 */
var Type = {
 BYTE: {
    sizeof: 1,

    /**
     * @param {Buffer} buffer
     * @param {number=} opt_byteOffset
     * @return {number}
     */
    read: function (buffer, opt_byteOffset) {
      return buffer.readUInt8(opt_byteOffset || 0);
    }
  },

  CHAR: {
    sizeof: 1,

    /**
     * @param {Buffer} buffer
     * @param {number=} opt_byteOffset
     * @return {number}
     */
    read: function (buffer, opt_byteOffset) {
      return buffer.readInt8(opt_byteOffset || 0);
    }
  },

  USHORT: {
    sizeof: 2,

    /**
     * @param {Buffer} buffer
     * @param {number=} opt_byteOffset
     * @return {number}
     */
    read: function (buffer, opt_byteOffset) {
      return buffer.readUInt16BE(opt_byteOffset || 0);
    }
  },

  SHORT: {
    sizeof: 2,

    /**
     * @param {Buffer} buffer
     * @param {number=} opt_byteOffset
     * @return {number}
     */
    read: function (buffer, opt_byteOffset) {
      return buffer.readInt16BE(opt_byteOffset || 0);
    }
  },

  ULONG: {
    sizeof: 4,

    /**
     * @param {Buffer} buffer
     * @param {number=} opt_byteOffset
     * @return {number}
     */
    read: function (buffer, opt_byteOffset) {
      return buffer.readUInt32BE(opt_byteOffset || 0);
    }
  },

  LONG: {
    sizeof: 4,

    /**
     * @param {Buffer} buffer
     * @param {number=} opt_byteOffset
     * @return {number}
     */
    read: function (buffer, opt_byteOffset) {
      return buffer.readInt32BE(opt_byteOffset || 0);
    }
  },

  TAG: {
    sizeof: 4,

    /**
     * @param {Buffer} buffer
     * @param {number=} opt_byteOffset
     * @return {string}
     */
    read: function (buffer, opt_byteOffset) {
      var uint = buffer.readUInt32BE(opt_byteOffset || 0);

      return String.fromCharCode((uint & 0xFF000000) >> 24) +
             String.fromCharCode((uint & 0x00FF0000) >> 16) +
             String.fromCharCode((uint & 0x0000FF00) >> 8) +
             String.fromCharCode((uint & 0x000000FF) >> 0);
    }
  },

  FIXED: {
    sizeof: 4,

    /**
     * @param {Buffer} buffer
     * @param {number=} opt_byteOffset
     * @return {number}
     */
    read: function (buffer, opt_byteOffset) {
      return buffer.readUInt32BE(opt_byteOffset || 0);
    }
  },

  LONGDATETIME: {
    sizeof: 8,

    /**
     * @param {Buffer} buffer
     * @param {number=} opt_byteOffset
     * @return {Int64}
     */
    read: function (buffer, opt_byteOffset) {
      return new Int64(buffer.slice(opt_byteOffset || 0, (opt_byteOffset || 0) + 8));
    }
  },

  UINT24: {
    sizeof: 3,

    /**
     * @param {Buffer} buffer
     * @param {number=} opt_byteOffset
     * @return {number}
     */
    read: function (buffer, opt_byteOffset) {
      return buffer.readUIntBE(opt_byteOffset || 0, 3);
    }
  }
};

// Aliases
Type.FWORD = Type.SHORT;
Type.UFWORD = Type.USHORT;
Type.GLYPHID = Type.USHORT;
Type.OFFSET = Type.USHORT;

module.exports = Type;
