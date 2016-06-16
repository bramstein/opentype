var Type = require('../src/type');
var Int64 = require('node-int64');
var expect = require('unexpected');
var c = require('concentrate');

describe('Type', function () {
  describe('BYTE', function () {
    it('reads a byte', function () {
      var data = c().uint8(12).result();

      expect(Type.BYTE.read(data), 'to equal', 12);
    });

    it('reads unsigned bytes', function () {
      var data = c().int8(-10).result();

      expect(Type.BYTE.read(data), 'to equal', 246);
    });

    it('reads a byte at an offset', function () {
      var data = c().uint8(10).uint8(20).result();

      expect(Type.BYTE.read(data, 1), 'to equal', 20);
    });
  });

  describe('CHAR', function () {
    it('reads a char', function () {
      var data = c().int8(12).result();

      expect(Type.CHAR.read(data), 'to equal', 12);
    });

    it('reads a signed char', function () {
      var data = c().int8(-10).result();

      expect(Type.CHAR.read(data), 'to equal', -10);
    });

    it('reads a char at an offset', function () {
      var data = c().uint8(10).uint8(20).result();

      expect(Type.CHAR.read(data, 1), 'to equal', 20);
    });
  });

  describe('USHORT', function () {
    it('reads an ushort', function () {
      var data = c().uint16be(256).result();

      expect(Type.USHORT.read(data), 'to equal', 256);
    });

    it('reads unsigned shorts', function () {
      var data = c().int16be(-256).result();

      expect(Type.USHORT.read(data), 'to equal', 65280);
    });

    it('reads an unsigned short at an offset', function () {
      var data = c().uint8(10).uint16be(256).result();

      expect(Type.USHORT.read(data, 1), 'to equal', 256);
    });
  });

  describe('SHORT', function () {
    it('reads a short', function () {
      var data = c().int16be(256).result();

      expect(Type.SHORT.read(data), 'to equal', 256);
    });

    it('reads unsigned shorts', function () {
      var data = c().int16be(-256).result();

      expect(Type.SHORT.read(data), 'to equal', -256);
    });

    it('reads a short at an offset', function () {
      var data = c().uint8(10).int16be(-256).result();

      expect(Type.SHORT.read(data, 1), 'to equal', -256);
    });
  });

  describe('ULONG', function () {
    it('reads an ulong', function () {
      var data = c().uint32be(1024).result();

      expect(Type.ULONG.read(data), 'to equal', 1024);
    });

    it('reads unsigned shorts', function () {
      var data = c().int32be(-1024).result();

      expect(Type.ULONG.read(data), 'to equal', 4294966272);
    });

    it('reads an unsigned short at an offset', function () {
      var data = c().uint8(10).uint32be(1024).result();

      expect(Type.ULONG.read(data, 1), 'to equal', 1024);
    });
  });

  describe('LONG', function () {
    it('reads a long', function () {
      var data = c().int32be(1024).result();

      expect(Type.LONG.read(data), 'to equal', 1024);
    });

    it('reads unsigned longs', function () {
      var data = c().int32be(-1024).result();

      expect(Type.LONG.read(data), 'to equal', -1024);
    });

    it('reads a long at an offset', function () {
      var data = c().uint8(10).int32be(-1024).result();

      expect(Type.LONG.read(data, 1), 'to equal', -1024);
    });
  });

  describe('TAG', function () {
    it('reads a tag', function () {
      var data = c().string('cmap', 'ascii').result();

      expect(Type.TAG.read(data), 'to equal', 'cmap');

      var data = c().string('OS/2', 'ascii').result();

      expect(Type.TAG.read(data), 'to equal', 'OS/2');

      var data = c().string('CFF ', 'ascii').result();

      expect(Type.TAG.read(data), 'to equal', 'CFF ');
    });

    it('reads a tag at an offset', function () {
      var data =  c().uint8(10).string('cmap', 'ascii').result();

      expect(Type.TAG.read(data, 1), 'to equal', 'cmap');
    });
  });

  describe('FIXED', function () {
    it('reads a fixed number', function () {
      var data = c().int32be(0x00000001).result();

      expect(Type.FIXED.read(data), 'to equal', 0x00000001);

      var data = c().int32be(0x00010000).result();

      expect(Type.FIXED.read(data), 'to equal', 0x00010000);

      var data = c().int32be(0x00005000).result();

      expect(Type.FIXED.read(data), 'to equal', 0x00005000);
    });

    it('reads a fixed number at an offset', function () {
      var data = c().uint8(10).int32be(0x00010000).result();

      expect(Type.FIXED.read(data, 1), 'to equal', 0x00010000);
    });
  });

  describe('LONGDATETIME', function () {
    it('reads a long date time', function () {
      var data = c().buffer(new Int64(10).toBuffer()).result();

      expect(Type.LONGDATETIME.read(data), 'to equal', new Int64(10));
    });

    it('reads a long date time at an offset', function () {
      var data = c().uint8(10).buffer(new Int64(10).toBuffer()).result();

      expect(Type.LONGDATETIME.read(data, 1), 'to equal', new Int64(10));
    });
  });

  describe('UINT24', function () {
    it('reads an unsigned int 24', function () {
      var data = new Buffer([0x01, 0x02, 0x03]);

      expect(Type.UINT24.read(data), 'to equal', 66051);
    });

    it('reads an unsigned int 24 at an offset', function () {
      var data = c().uint8(10).buffer(new Buffer([0x01, 0x02, 0x03])).result();

      expect(Type.UINT24.read(data, 1), 'to equal', 66051);
    });
  });
});
