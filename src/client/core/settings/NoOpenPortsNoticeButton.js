/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');
var TooltipMixin = require('../tooltip/TooltipMixin');

var NoOpenPortsNoticeButton = React.createClass({

	mixins: [
		I18nMixin,
		TooltipMixin
	],

	getDefaultProps: function () {
		return {
			enableTooltip: true,
			tooltipPosition: 'left middle',
			tooltipClassName: 'no-open-ports-notice-tooltip',
			tooltipOffset: '0 10px'
		};
	},

	getTooltipElement: function () {
		return this.refs.noOpenPortsNoticeButton.getDOMNode();
	},

	getTooltipContent: function () {
		return this.getNoOpenPortsNotice();
	},

	getNoOpenPortsNotice: function () {
		return (
			<p className='no-open-ports-notice'>{this.i18n('openPortsHandler_noOpenPorts_notice')}</p>
		)
	},

	render: function () {
		return (
			<p className='no-open-ports-notice-button-wrapper'>
				<span ref='noOpenPortsNoticeButton'>{this.i18n('openPortsHandler_noOpenPortsNoticeButton_label')} »</span>
			</p>
		)
	}

});

module.exports = NoOpenPortsNoticeButton;