goog.provide('opentype.util');

goog.scope(function () {
  var util = opentype.util;

  /**
   * @param {number} bufferLength
   * @param {number=} opt_blockSize
   * @return {number}
   */
  util.pad = function (bufferLength, opt_blockSize) {
    var blockSize = opt_blockSize || 4;

    return bufferLength % blockSize === 0 ? bufferLength : bufferLength + (blockSize - (bufferLength % blockSize));
  };

  /**
   * @param {...*} var_args
   * @return {*}
   */
  util.extend = function (var_args) {
    for (var i = 1; i < arguments.length; i += 1) {
      for (var p in arguments[i]) {
        if (arguments[i].hasOwnProperty(p)) {
          arguments[0][p] = arguments[i][p];
        }
      }
    }
    return arguments[0];
  };

  /**
   * @param {Array.<number>} array
   * @return {string}
   */
  util.byteArrayToString = function (array) {
    var result = '';

    for (var i = 0; i < array.length; i += 1) {
      result += String.fromCharCode(array[i]);
    }

    return result;
  };

  /**
   * Create a struct of a fixed size.
   *
   * @param {Object.<string, opentype.Type>} types
   * @return {opentype.Struct}
   */
  util.struct = function (types) {
    var sizeof = 0;

    for (var key in types) {
      sizeof += types[key].sizeof;
    }

    return {
      sizeof: sizeof,
      read: function (dataView, opt_byteOffset) {
        var byteOffset = opt_byteOffset || 0,
            struct = {};

        for (var key in types) {
          struct[key] = types[key].read(dataView, byteOffset);
          byteOffset += types[key].sizeof;
        }

        return struct;
      }
    };
  };

  /*
  util.checksum = function (arrayBuffer, byteOffset, byteLength) {
    byteOffset = byteOffset || 0;
    byteLength = byteLength || arrayBuffer.byteLength;
  };
  */
});
