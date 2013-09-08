goog.provide('opentype.Buffer');

goog.scope(function () {
  /**
   * @constructor
   * @param {DataView} dataView
   * @param {number=} opt_byteOffset
   */
  opentype.Buffer = function (dataView, opt_byteOffset) {
    this.dataView = dataView;
    this.byteOffset = opt_byteOffset || 0;
  };

  var Buffer = opentype.Buffer;

  /**
   * Jump to an offset in this buffer
   * @param {number} byteOffset
   */
  Buffer.prototype.goto = function (byteOffset) {
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
  Buffer.prototype.read = function (type, opt_byteOffset) {
    var data = type.read(this.dataView, opt_byteOffset || this.byteOffset);

    if (!goog.isDef(opt_byteOffset)) {
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
  Buffer.prototype.readArray = function (type, count, opt_byteOffset) {
    var byteOffset = opt_byteOffset || this.byteOffset,
        data = [];

    for (var i = 0; i < count; i += 1) {
      data.push(type.read(this.dataView, byteOffset));
      byteOffset += type.sizeof;
    }

    if (!goog.isDef(opt_byteOffset)) {
      this.byteOffset += type.sizeof * count;
    }

    return data;
  };
});
