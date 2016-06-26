var ReadBuffer = require('../src/readbuffer');
var Type = require('../src/type');
var c = require('concentrate');
var expect = require('unexpected');

describe('ReadBuffer', function () {
  it('creates a new buffer', function () {
    var data = c()
      .uint32be(4)
      .result();

    expect(new ReadBuffer(data), 'to be an object');
  });

  it('can read data', function () {
    var data = c()
      .uint32be(4)
      .result();

    expect(new ReadBuffer(data).read(Type.ULONG), 'to equal', 4);
  });

  it('can can read an array', function () {
    var data = c()
      .uint32be(10)
      .uint32be(20)
      .uint32be(30)
      .result();

    expect(new ReadBuffer(data).readArray(Type.ULONG, 3), 'to equal', [10, 20, 30]);
  });

  it('can read a string', function () {
    var data = c()
      .string('hello')
      .result();

    expect(new ReadBuffer(data).readString('ascii', 5), 'to equal', 'hello');
  });
});
