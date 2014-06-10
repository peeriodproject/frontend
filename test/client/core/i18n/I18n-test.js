jest.dontMock('../../../../src/client/core/i18n/I18nMixin');

describe('CLIENT --> CORE --> I18N --> I18nMixin', function() {
	beforeEach(function () {
		global.chrome = {
			i18n: {
				getMessage: jest.genMockFunction().mockImplementation(function(key) {
					return 'value-' + key;
				})
			}
		};
	});

    it('returns the correct value for the given key', function() {
        
        var I18nMixin = require('../../../../src/client/core/i18n/I18nMixin');
        var value = I18nMixin.i18n('foo');

        expect(value).toEqual('value-foo');
        expect(global.chrome.i18n.getMessage.mock.calls.length).toBe(1);
        expect(global.chrome.i18n.getMessage.mock.calls[0][0]).toBe('foo');
    });
});