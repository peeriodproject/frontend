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

var NoOpenPortsNoticeButton = require('./NoOpenPortsNoticeButton');

var OpenPortsHandler = React.createClass({

	mixins: [
		I18nMixin,
		ChannelMixin
	],

	channelNames: [
		'openports'
	],

	initialChannelsState: {
		ports: [],
		portsChanged: false
	},

	getInitialState: function () {
		return {
			showAddPortForm: false
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

	getNoOpenPortsNoticeButton: function () {
		return <NoOpenPortsNoticeButton />;
	},

	getPortChangedNotice: function () {
		return (
			<div className='ports-changed-notice'>
				<h3>{this.i18n('openPortsHandler_portsChangedNotice_title')}</h3>
				<p>{this.i18n('openPortsHandler_portsChangedNotice_content')}</p>
			</div>
		)
	},

	hasOpenPorts: function () {
		return this.state.ports && this.state.ports.length ? true : false;
	},

	handleFormSubmit: function (event) {
		event.preventDefault();
		this.checkAndSubmitPort();
	},

	handleAddPortButtonClick: function (event) {
		event.preventDefault();

		if (!this.state.showAddPortForm) {
			this.setState({
				showAddPortForm: true
			});
		}
		else if (this.refs.portInput.getDOMNode().value) {
			this.checkAndSubmitPort();
		}
		else {
			this.setState({
				showAddPortForm: false
			});
		}
	},

	handleRemovePortClick: function (port) {
		this.openportsChannel.send('removePort', port);
	},

	checkAndSubmitPort: function () {
		var port = this.refs.portInput.getDOMNode().value;

		if (port) {
			this.openportsChannel.send('addPort', port);
			
			this.setState({
				showAddPortForm: false
			});
		}

		return false;
	},

	render: function () {
		var hasOpenPorts = this.hasOpenPorts();
		var hasOpenPortsClassName = hasOpenPorts ? ' has-open-ports' : '';
		var portListOrNotice = hasOpenPorts ? this.getOpenPortsList() : this.getNoOpenPortsNoticeButton();
		var portsChangedNotice = this.state.portsChanged ? (this.getPortChangedNotice()) : null;
		var addPortButtonLabel = hasOpenPorts ? 'openPortsHandler_hasOpenPort_addPortButton_label' : 'openPortsHandler_noOpenPort_addPortButton_label';

		var showFormClassName = this.state.showAddPortForm ? ' active' : '';

		return (
			<section className={'open-ports-handler' + hasOpenPortsClassName}>
				{portsChangedNotice}

				{portListOrNotice}

				<form className={'add-port-form' + showFormClassName} onSubmit={this.handleFormSubmit}>
					<label>{this.i18n('openPortsHandler_enterOpenPort_label')}</label>
					<input type='number' ref='portInput' className='add-port-input' />
				</form>

				<a href='#' ref='addPortButton' className='add-port-button' onClick={this.handleAddPortButtonClick}>
					<SvgIcon icon='plus' /> {this.i18n(addPortButtonLabel)}
				</a>
			</section>
		)
	}
});

module.exports = OpenPortsHandler;