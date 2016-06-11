var Format = require('./Format');
var Type = require('./Type');
var util = require('./util');
var sfnt = require('./sfnt');
var woff = require('./woff');
var ReadBuffer = require('./readbuffer');
var zlib = require('zlib');

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

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

/**
 * @param {ArrayBuffer} arrayBuffer
 */
var parse = function (arrayBuffer) {
  var buffer = new ReadBuffer(new DataView(arrayBuffer)),
      font = {
        tables: {}
      };

  var signature = buffer.read(Type.ULONG, 0);

  if (signature === Format.WOFF) {
    font.header = buffer.read(woff.Header);
    var index = buffer.readArray(woff.TableDirectory, font.header.numTables);

    index.forEach(function (table) {
      var data = null,
          tag = table.tag;

      if (table.compLength !== table.origLength) {
        var compressedData = toBuffer(new Uint8Array(arrayBuffer, table.offset, util.pad(table.compLength)));
        var decompressedData = new zlib.inflateSync(compressedData);

        font.tables[tag] = new DataView(toArrayBuffer(decompressedData));
      } else {
        font.tables[tag] = new DataView(arrayBuffer, table.offset, util.pad(table.origLength));
      }
    });
  } else if (signature === Format.TRUETYPE || signature === Format.OPENTYPE) {
    font.header = buffer.read(sfnt.Header);
    var index = buffer.readArray(sfnt.OffsetTable, font.header.numTables);

    index.forEach(function (table) {
      font.tables[table.tag] = new DataView(arrayBuffer, table.offset, util.pad(table.length));
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
