var ReadBuffer = require('../src/readbuffer');
var Type = require('../src/type');
var util = require('../src/util');
var c = require('concentrate');
var expect = require('unexpected');

describe('ReadBuffer', function () {
  var data = null;

  beforeEach(function () {
    data = c()
      .uint8(10)
      .uint8(20)
      .uint8(30)
      .uint8(40)
      .result();
  });

  it('creates a new ReadBuffer', function () {
    var buffer = new ReadBuffer(data);

    expect(buffer, 'to be an object');
    expect(buffer.byteOffset, 'to equal', 0);
  });

  it('creates a new ReadBuffer with an offset', function () {
    var buffer = new ReadBuffer(data, 2);

    expect(buffer, 'to be an object');
    expect(buffer.byteOffset, 'to equal', 2);
  });

  it('can goto any offset', function () {
    var buffer = new ReadBuffer(data);

    buffer.goto(2);
    expect(buffer.byteOffset, 'to equal', 2);
  });

  it('can read bytes', function () {
    var buffer = new ReadBuffer(data);

    expect(buffer.read(Type.BYTE), 'to equal', 10);
    expect(buffer.read(Type.BYTE), 'to equal', 20);
    expect(buffer.read(Type.BYTE), 'to equal', 30);
    expect(buffer.read(Type.BYTE), 'to equal', 40);
  });

  it('can goto any offset and read bytes', function () {
    var buffer = new ReadBuffer(data);

    buffer.goto(2);
    expect(buffer.read(Type.BYTE, 2), 'to equal', 30);
    expect(buffer.read(Type.BYTE, 1), 'to equal', 20);
  });

  it('can read an array of bytes', function () {
    var buffer = new ReadBuffer(data);

    expect(buffer.readArray(Type.BYTE, 4), 'to equal', [10, 20, 30, 40]);
  });

  it('can goto any offset and read an array of bytes', function () {
    var buffer = new ReadBuffer(data);

    expect(buffer.readArray(Type.BYTE, 2, 2), 'to equal', [30, 40]);
  });

  it('can read a complex struct', function () {
    var buffer = new ReadBuffer(data);

    expect(buffer.read(util.struct({ first: Type.BYTE, second: Type.BYTE })), 'to equal', { first: 10, second: 20 });
  });

  it('can read an array of complex structs', function () {
    var buffer = new ReadBuffer(data);

    expect(buffer.readArray(util.struct({ first: Type.BYTE, second: Type.BYTE }), 2), 'to equal', [{ first: 10, second: 20 }, { first: 30, second: 40 }]);
  });

  it('can read a string', function () {
    var data = c()
      .string('hello')
      .result();

    expect(new ReadBuffer(data).readString('ascii', 5), 'to equal', 'hello');
  });

  it('can read a string at an offset', function () {
    var data = c()
      .uint8(10)
      .string('hello')
      .result();

    expect(new ReadBuffer(data).readString('ascii', 5, 1), 'to equal', 'hello');
  });
});
