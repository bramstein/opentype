goog.provide('opentype.Type');

goog.scope(function () {
  /**
   * @enum {opentype.Struct}
   */
  opentype.Type = {
   BYTE: {
      sizeof: 1,

      /**
       * @param {DataView} dataView
       * @param {number=} opt_byteOffset
       * @return {number}
       */
      read: function (dataView, opt_byteOffset) {
        return dataView.getUint8(opt_byteOffset || 0);
      }
    },

    CHAR: {
      sizeof: 1,

      /**
       * @param {DataView} dataView
       * @param {number=} opt_byteOffset
       * @return {number}
       */
      read: function (dataView, opt_byteOffset) {
        return dataView.getInt8(opt_byteOffset || 0);
      }
    },

    USHORT: {
      sizeof: 2,

      /**
       * @param {DataView} dataView
       * @param {number=} opt_byteOffset
       * @return {number}
       */
      read: function (dataView, opt_byteOffset) {
        return dataView.getUint16(opt_byteOffset || 0);
      }
    },

    SHORT: {
      sizeof: 2,

      /**
       * @param {DataView} dataView
       * @param {number=} opt_byteOffset
       * @return {number}
       */
      read: function (dataView, opt_byteOffset) {
        return dataView.getInt16(opt_byteOffset || 0);
      }
    },

    ULONG: {
      sizeof: 4,

      /**
       * @param {DataView} dataView
       * @param {number=} opt_byteOffset
       * @return {number}
       */
      read: function (dataView, opt_byteOffset) {
        return dataView.getUint32(opt_byteOffset || 0);
      }
    },

    LONG: {
      sizeof: 4,

      /**
       * @param {DataView} dataView
       * @param {number=} opt_byteOffset
       * @return {number}
       */
      read: function (dataView, opt_byteOffset) {
        return dataView.getInt32(opt_byteOffset || 0);
      }
    },

    TAG: {
      sizeof: 4,

      /**
       * @param {DataView} dataView
       * @param {number=} opt_byteOffset
       * @return {string}
       */
      read: function (dataView, opt_byteOffset) {
        var uint = dataView.getUint32(opt_byteOffset || 0);

        return String.fromCharCode((uint & 0xFF000000) >> 24) +
               String.fromCharCode((uint & 0x00FF0000) >> 16) +
               String.fromCharCode((uint & 0x0000FF00) >> 8) +
               String.fromCharCode((uint & 0x000000FF) >> 0);
      }
    },

    FIXED: {
      sizeof: 4,

      /**
       * @param {DataView} dataView
       * @param {number=} opt_byteOffset
       * @return {number}
       */
      read: function (dataView, opt_byteOffset) {
        var integer = dataView.getInt16(opt_byteOffset || 0),
            decimal = dataView.getInt16(opt_byteOffset || 0 + 2);

        // This is ugly, but gives better precision than getInt32 / 65536
        return +(integer + "." + decimal);
      }
    },

    LONGDATETIME: {
      sizeof: 8,

      /**
       * @param {DataView} dataView
       * @param {number=} opt_byteOffset
       * @return {{high: number, low: number}}
       */
      read: function (dataView, opt_byteOffset) {
        var byteOffset = opt_byteOffset || 0;

        return {
          high: dataView.getInt32(byteOffset),
          low: dataView.getInt32(byteOffset + 4)
        };
      }
    }
  };

  var Type = opentype.Type;

  // Aliases
  Type.FWORD = Type.SHORT;
  Type.UFWORD = Type.USHORT;
  Type.GLYPHID = Type.USHORT;
  Type.OFFSET = Type.USHORT;
});
