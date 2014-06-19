/** 
 * @jsx React.DOM
 */
'use strict';

jest.dontMock('../../../../src/client/core/element/Badge');

describe('CLIENT --> CORE --> ELEMENT --> Badge', function () {
	beforeEach(function () {
		global.chrome = {
			i18n: {
				getMessage: jest.genMockFunction().mockImplementation(function(key) {
					return 'value-' + key;
				})
			}
		};
	});

	it('should correctly render the badge element', function () {
		var React = require('react/addons');
		var Badge = require('../../../../src/client/core/element/Badge');
		var TestUtils = React.addons.TestUtils;

		var badge = <Badge label='badge label' />
		
		TestUtils.renderIntoDocument(badge);

		var badgeInstance = TestUtils.findRenderedDOMComponentWithTag(badge, 'div');
		var node = badgeInstance.getDOMNode();

		expect(node.className).toContain('badge');
	});

	it('should correctly use the i18n mixin for non numeric labels', function () {
		var React = require('react/addons');
		var Badge = require('../../../../src/client/core/element/Badge');
		var TestUtils = React.addons.TestUtils;

		var badge = <Badge label='badge label' />
		
		TestUtils.renderIntoDocument(badge);

		var badgeInstance = TestUtils.findRenderedDOMComponentWithTag(badge, 'div');
		var node = badgeInstance.getDOMNode();

		expect(chrome.i18n.getMessage.mock.calls.length).toEqual(1);
		expect(node.textContent).toEqual('value-badge label');
	});

	it('should correctly show numeric labels without the use of the i18n mixin', function () {
		var React = require('react/addons');
		var Badge = require('../../../../src/client/core/element/Badge');
		var TestUtils = React.addons.TestUtils;

		var badge = <Badge label='100' />
		
		TestUtils.renderIntoDocument(badge);

		var badgeInstance = TestUtils.findRenderedDOMComponentWithTag(badge, 'div');
		var node = badgeInstance.getDOMNode();

		expect(chrome.i18n.getMessage.mock.calls.length).toEqual(0);
		expect(node.textContent).toEqual('100');
	});

});