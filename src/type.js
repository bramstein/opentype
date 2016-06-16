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
      return buffer.toString('ascii', opt_byteOffset || 0, (opt_byteOffset || 0) + 4);
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
  },

  BASE128: {
    /**
     * Variable size, set automatically by the
     * read method.
     */
    sizeof: 0,

    /**
     * @param {Buffer} buffer
     * @param {number=} opt_byteOffset
     * @return {number}
     */
    read: function (buffer, opt_byteOffset) {
      var result = 0;
      this.sizeof = 0;

      for (var i = 0; i < 5; i++) {
        data = buffer.readUInt8((opt_byteOffset || 0) + i);

        if (result & 0xFE0000000) {
          throw new Error('Base 128 number overflow');
        }

        result = (result << 7) | (data & 0x7F);

        if ((data & 0x80) === 0) {
          this.sizeof = i + 1;
          return result;
        }
      }
      throw new Error('Bad base 128 number');
    }
  }
};

// Aliases
Type.FWORD = Type.SHORT;
Type.UFWORD = Type.USHORT;
Type.GLYPHID = Type.USHORT;
Type.OFFSET = Type.USHORT;

module.exports = Type;
