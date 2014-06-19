jest.dontMock('../../../src/client/core/sum');

describe('sum', function() {
    it('adds 1 + 2 to equal 3', function() {
        var sum = require('../../../src/client/core/sum');
        expect(sum(1, 2)).toBe(3);
    });
});