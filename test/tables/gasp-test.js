var gasp = require('../../src/tables/gasp');
var expect = require('unexpected');
var c = require('concentrate');

describe('tables.gasp', function () {
  it('reads a single gasp entry', function () {
    var data = c()
      .uint16be(1)      // version 1
      .uint16be(1)      // numRanges: 1
      .uint16be(1024)   // rangeMaxPPEM
      .uint16be(0x0002) // rangeGaspBehaviour
      .result();

    expect(gasp(data), 'to equal', {
      gaspRange: [{
        rangeMaxPPEM: 1024,
        rangeGaspBehavior: 0x0002
      }]
    });
  });

  it('reads multiple gasp entries', function () {
    var data = c()
      .uint16be(1)
      .uint16be(2)
      .uint16be(256)
      .uint16be(0x0003)
      .uint16be(32)
      .uint16be(0x000C)
      .result();

    expect(gasp(data), 'to equal', {
      gaspRange: [{
        rangeMaxPPEM: 256,
        rangeGaspBehavior: 0x0003
      }, {
        rangeMaxPPEM: 32,
        rangeGaspBehavior: 0x000C
      }]
    });
  });
});
