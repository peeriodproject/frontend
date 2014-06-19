/** 
 * @jsx React.DOM
 */
'use strict';

jest.dontMock('../../../../src/client/core/element/Button');
jest.dontMock('../../../../src/client/core/i18n/I18nMixin');

describe('CLIENT --> CORE --> ELEMENT --> Button', function() {
	var getName = function(obj) { 
		var funcNameRegex = /function (.{1,})\(/;
		var results = (funcNameRegex).exec((obj).constructor.toString());

		return (results && results.length > 1) ? results[1] : "";
	};

	beforeEach(function () {
		global.chrome = {
			i18n: {
				getMessage: jest.genMockFunction().mockImplementation(function(key) {
					return 'value-' + key;
				})
			}
		};
	});
	
	it('should correctly render the button element', function() {
		var React = require('react/addons');
		var Button = require('../../../../src/client/core/element/Button');
		var TestUtils = React.addons.TestUtils;

		var button = <Button label='key' className='class-name' type='submit' />

		TestUtils.renderIntoDocument(button);

		var buttonInstance = TestUtils.findRenderedDOMComponentWithTag(button, 'button');

		expect(buttonInstance.getDOMNode().textContent).toEqual('value-key');
		expect(buttonInstance.getDOMNode().className).toContain('class-name');
		expect(buttonInstance.getDOMNode().type).toEqual('submit');
	});

	it('should correctly call the given callback with the event as first argument on click and add "bg-active" to the className attribute', function () {
		var React = require('react/addons');
		var Button = require('../../../../src/client/core/element/Button');
		var TestUtils = React.addons.TestUtils;
		var onClickFn = jest.genMockFunction();

		var button = <Button onClick={onClickFn} />

		TestUtils.renderIntoDocument(button);

		var buttonInstance = TestUtils.findRenderedDOMComponentWithTag(button, 'button');

		TestUtils.Simulate.click(buttonInstance);

		expect(onClickFn.mock.calls.length).toEqual(1);
		expect(getName(onClickFn.mock.calls[0][0])).toEqual('SyntheticEvent');

		expect(buttonInstance.getDOMNode().className).toContain('bg-active');
	});

	it('should correctly call the given callback with the event as the first arguments on enter and add "bg-hover bg-border-dark" to the className attribute', function () {
		var React = require('react/addons');
		var Button = require('../../../../src/client/core/element/Button');
		var TestUtils = React.addons.TestUtils;
		var onMouseEnterFn = jest.genMockFunction();

		var button = <Button onMouseEnter={onMouseEnterFn} />

		TestUtils.renderIntoDocument(button);

		var buttonInstance = TestUtils.findRenderedDOMComponentWithTag(button, 'button');

		TestUtils.SimulateNative.mouseOver(buttonInstance);

		expect(onMouseEnterFn.mock.calls.length).toEqual(1);
		expect(getName(onMouseEnterFn.mock.calls[0][0])).toEqual('SyntheticMouseEvent');

		expect(buttonInstance.getDOMNode().className).toContain('bg-hover bg-border-dark');
	});

	it('should correctly call the given callback with the event as the first arguments on leave and remove "bg-hover bg-border-dark" from the className attribute', function () {
		var React = require('react/addons');
		var Button = require('../../../../src/client/core/element/Button');
		var TestUtils = React.addons.TestUtils;
		var onMouseLeaveFn = jest.genMockFunction();

		var button = <Button onMouseLeave={onMouseLeaveFn} />

		TestUtils.renderIntoDocument(button);

		var buttonInstance = TestUtils.findRenderedDOMComponentWithTag(button, 'button');

		TestUtils.SimulateNative.mouseOver(buttonInstance);
		TestUtils.SimulateNative.mouseOut(buttonInstance);

		expect(onMouseLeaveFn.mock.calls.length).toEqual(1);
		expect(getName(onMouseLeaveFn.mock.calls[0][0])).toEqual('SyntheticMouseEvent');

		expect(buttonInstance.getDOMNode().className).not.toContain('bg-hover bg-border-dark');
	});

});