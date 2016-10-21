var expect = require('unexpected');

describe('basic', function () {
  it('can be required without the path to the main source file', function () {
    var opentype = require('../')

    expect(typeof opentype, 'to equal', 'object');
    expect(typeof opentype.parse, 'to equal', 'function');
  });
});
