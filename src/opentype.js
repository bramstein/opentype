var Format = require('./format');
var Type = require('./type');
var util = require('./util');
var sfnt = require('./sfnt');
var woff = require('./woff');
var woff2 = require('./woff2');
var ReadBuffer = require('./readbuffer');
var zlib = require('zlib');
var brotli = require('brotli');

var cmap = require('./tables/cmap');
var head = require('./tables/head');
var hhea = require('./tables/hhea');
var maxp = require('./tables/maxp');
var hmtx = require('./tables/hmtx');
var name = require('./tables/name');
var os_2 = require('./tables/os2');
var post = require('./tables/post');
var gsub = require('./tables/gsub');
var gdef = require('./tables/gdef');
var gasp = require('./tables/gasp');

var TABLES = {
  // Note that the order of the tables
  // is important. The `hmtx` table requires
  // `hhea` and `maxp` tables to be parsed. The
  // `post` table (depending on its version)
  // requires the `maxp` table to be parsed.
  'cmap': cmap,
  'head': head,
  'hhea': hhea,
  'maxp': maxp,
  'hmtx': hmtx,
  'name': name,
  'OS/2': os_2,
  'post': post,
  'GSUB': gsub,
  'GDEF': gdef,
  'gasp': gasp
};

/**
 * @param {Buffer} buffer
 */
var parse = function (buffer) {
  var rb = new ReadBuffer(buffer),
      font = {
        tables: {}
      };

  var signature = rb.read(Type.ULONG, 0);

  if (signature === Format.WOFF) {
    font.header = rb.read(woff.Header);
    var index = rb.readArray(woff.TableDirectory, font.header.numTables);

    index.forEach(function (table) {
      var data = null,
          tag = table.tag;

      if (table.compLength !== table.origLength) {
        var compressedData = buffer.slice(table.offset, table.offset + util.pad(table.compLength));

        font.tables[tag] = zlib.inflateSync(compressedData);
      } else {
        font.tables[tag] = buffer.slice(table.offset, table.offset + util.pad(table.origLength));
      }
    });
  } else if (signature === Format.WOFF2) {
    var index = [];
    var totalSize = 0;

    font.header = rb.read(woff2.Header);

    for (var i = 0; i < font.header.numTables; i++) {
      var flag = rb.read(Type.BYTE);
      var tag = null;

      if (flag === 63) {
        tag = rb.read(Type.TAG);
      } else {
        tag = woff2.Flags[flag];
      }

      var origLength = rb.read(Type.BASE128);

      var transformVersion = (flag >>> 6) & 0x03;
      if (tag === 'glyf' || tag === 'loca') {
        transformVersion = 0;

        var transformLength = rb.read(Type.BASE128);
      }

      totalSize += origLength;

      index.push({
        flags: flag,
        tag: tag,
        origLength: origLength
      });
    }

    // TODO: Upgrade to Node v6.x so we can use Buffer.from.
    var data = new Buffer(brotli.decompress(buffer.slice(rb.byteOffset, rb.byteOffset + totalSize)));
    var offset = 0;

    index.forEach(function (table) {
      font.tables[table.tag] = data.slice(offset, offset + util.pad(table.origLength));
      offset += table.origLength;
    });
  } else if (signature === Format.TRUETYPE || signature === Format.OPENTYPE) {
    font.header = rb.read(sfnt.Header);
    var index = rb.readArray(sfnt.OffsetTable, font.header.numTables);

    index.forEach(function (table) {
      font.tables[table.tag] = buffer.slice(table.offset, table.offset + util.pad(table.length));
    });
  }

  for (var table in TABLES) {
    if (font.tables[table]) {
      font.tables[table] = TABLES[table](font.tables[table], font);
    }
  }

  return font;
};

module.exports = {
  parse: parse
};
