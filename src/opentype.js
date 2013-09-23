goog.provide('opentype');

goog.require('opentype.Format');
goog.require('opentype.Type');
goog.require('opentype.util');
goog.require('opentype.sfnt');
goog.require('opentype.woff');
goog.require('opentype.Buffer');

goog.require('opentype.tables.cmap');
goog.require('opentype.tables.head');
goog.require('opentype.tables.hhea');
goog.require('opentype.tables.maxp');
goog.require('opentype.tables.hmtx');
goog.require('opentype.tables.name');
goog.require('opentype.tables.os2');
goog.require('opentype.tables.post');
goog.require('opentype.tables.gsub');
goog.require('opentype.tables.gdef');
goog.require('opentype.tables.gasp');

goog.require('Zlib');
goog.require('Zlib.Inflate');

goog.require('debug');

goog.scope(function () {
  var Format = opentype.Format,
      Type = opentype.Type,
      util = opentype.util,
      sfnt = opentype.sfnt,
      woff = opentype.woff,
      Buffer = opentype.Buffer;

  opentype.table = {
    // Note that the order of the tables
    // is important. The `hmtx` table requires
    // `hhea` and `maxp` tables to be parsed. The
    // `post` table (depending on its version)
    // requires the `maxp` table to be parsed.
    'cmap': opentype.tables.cmap,
    'head': opentype.tables.head,
    'hhea': opentype.tables.hhea,
    'maxp': opentype.tables.maxp,
    'hmtx': opentype.tables.hmtx,
    'name': opentype.tables.name,
    'OS/2': opentype.tables.os2,
    'post': opentype.tables.post,
    'GSUB': opentype.tables.gsub,
    'GDEF': opentype.tables.gdef,
    'gasp': opentype.tables.gasp
  };

  /**
   * @param {ArrayBuffer} arrayBuffer
   */
  opentype.parse = function (arrayBuffer) {
    var buffer = new Buffer(new DataView(arrayBuffer)),
        font = {
          'tables': {}
        };

    var signature = buffer.read(Type.ULONG, 0);

    if (signature === Format.WOFF) {
      font['header'] = buffer.read(woff.Header);
      var index = buffer.readArray(woff.TableDirectory, font['header']['numTables']);

      index.forEach(function (table) {
        var data = null,
            tag = table.tag;

        if (table.compLength !== table.origLength) {
          var compressedData = new Uint8Array(arrayBuffer, table.offset, util.pad(table.compLength));
          var inflate = new Zlib.Inflate(compressedData, {
            bufferSize: table.origLength,
            bufferType: Zlib.Inflate.BufferType.BLOCK
          });

          font['tables'][tag] = new DataView(inflate.decompress().buffer);
        } else {
          font['tables'][tag] = new DataView(arrayBuffer, table.offset, util.pad(table.origLength));
        }
      });
    } else if (signature === Format.TRUETYPE || signature === Format.OPENTYPE) {
      font['header'] = buffer.read(sfnt.Header);
      var index = buffer.readArray(sfnt.OffsetTable, font['header']['numTables']);

      index.forEach(function (table) {
        font['tables'][table.tag] = new DataView(arrayBuffer, table.offset, util.pad(table.length));
      });
    }

    for (var table in opentype.table) {
      if (font['tables'][table]) {
        font['tables'][table] = opentype.table[table](font['tables'][table], font);
      }
    }

    return font;
  };
});

goog.exportSymbol('opentype.parse', opentype.parse);
