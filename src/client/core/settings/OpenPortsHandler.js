/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');
var ChannelMixin = require('../socket/ChannelMixin');
var TooltipMixin = require('../tooltip/TooltipMixin');

var OpenPort = require('./OpenPort');
var SvgIcon = require('../element/SvgIcon');

var OpenPortsHandler = React.createClass({

	mixins: [
		I18nMixin,
		ChannelMixin,
		TooltipMixin
	],

	channelNames: [
		'openports'
	],

	initialChannelsState: {
		ports: [],
		portsChanged: false
	},

	getDefaultProps: function () {
		return {
			enableTooltip: true,
			tooltipPosition: 'left middle',
			tooltipClassName: 'no-open-ports-notice-tooltip',
			tooltipOffset: '0 10px'
		};
	},

	updateOpenportsChannelState: function (state) {
		this.replaceState(state);
	},

	getOpenPortsList: function () {
		var openPorts = [];

		if (!this.state.ports || !this.state.ports.length) {
			return null;
		}

		for (var i = 0, l = this.state.ports.length; i < l; i++) {
			openPorts.push(
				<OpenPort key={'port-' + this.state.ports[i]} port={this.state.ports[i]} onClick={this.handleRemovePortClick} />
			);
		}

		return (
			<ul className='open-ports-list'>
				{openPorts}
			</ul>
		)
	},

	getNoOpenPortsNotice: function () {
		return (
			<p className='no-open-ports-notice'>{this.i18n('openPortsHandler_noOpenPorts_notice')}</p>
		)
	},

	getNoOpenPortsNoticeButton: function () {
		return (
			<p className='no-open-ports-notice-button-wrapper'>
				<span ref='noOpenPortsNoticeButton'>{this.i18n('OpenPortsHandler_noOpenPortsNoticeButton_label')} »</span>
			</p>
		)
	},

	getPortChangedNotice: function () {
		return (
			<div className='ports-changed-notice'>
				<h3>{this.i18n('openPortsHandler_portsChangedNotice_title')}</h3>
				<p>{this.i18n('openPortsHandler_portsChangedNotice_content')}</p>
			</div>
		)
	},

	getTooltipElement: function () {
		return this.refs.noOpenPortsNoticeButton.getDOMNode();
	},

	getTooltipContent: function () {
		return this.getNoOpenPortsNotice();
	},

	hasOpenPorts: function () {
		return this.state.ports && this.state.ports.length ? true : false;
	},

	handleAddPortButtonClick: function (event) {
		event.preventDefault();

		var port = prompt(this.i18n('openPortsHandler_enterOpenPort_label'));

		if (port) {
			this.openportsChannel.send('addPort', port);
		}
	},

	handleRemovePortClick: function (port) {
		this.openportsChannel.send('removePort', port);
	},

	render: function () {
		var hasOpenPorts = this.hasOpenPorts();
		var hasOpenPortsClassName = hasOpenPorts ? ' has-open-ports' : '';
		var portListOrNotice = hasOpenPorts ? this.getOpenPortsList() : this.getNoOpenPortsNoticeButton();
		var portsChangedNotice = this.state.portsChanged ? (this.getPortChangedNotice()) : null;
		var addPortButtonLabel = hasOpenPorts ? 'openPortsHandler_hasOpenPort_addPortButton_label' : 'openPortsHandler_noOpenPort_addPortButton_label';

		return (
			<section className={'open-ports-handler' + hasOpenPortsClassName}>
				{portsChangedNotice}

				{portListOrNotice}

				<a href='#' ref='addPortButton' className='add-port-button' onClick={this.handleAddPortButtonClick}>
					<SvgIcon icon='plus' /> {this.i18n(addPortButtonLabel)}
				</a>
			</section>
		)
	}
});

module.exports = OpenPortsHandler;