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
		openPorts: {
			ports: [],
			portsChanged: false
		},
		showAddPortForm: false
	},

	/*getInitialState: function () {
		return {
			
		};
	},*/

	componentDidUpdate: function () {
		var node;

		if (this.state.showAddPortForm && !this.getPortInputValue()) {
			node = this.getPortInputNode();

			if (node) {
				node.focus();
			}

		}
	},

	updateOpenportsChannelState: function (state) {
		this.setState({
			openPorts: state
		});
	},

	getOpenPortsList: function () {
		var openPorts = [];

		if (!this.state.openPorts.ports || !this.state.openPorts.ports.length) {
			return null;
		}

		for (var i = 0, l = this.state.openPorts.ports.length; i < l; i++) {
			openPorts.push(
				<OpenPort key={'port-' + this.state.openPorts.ports[i]} port={this.state.openPorts.ports[i]} onClick={this.handleRemovePortClick} />
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

	getPortInputValue: function () {
		var node = this.getPortInputNode();

		return node ? node.value : null;
	},

	getPortInputNode: function () {
		return this.refs.portInput.getDOMNode();
	},

	hasOpenPorts: function () {
		return this.state.openPorts.ports && this.state.openPorts.ports.length ? true : false;
	},

	handleFormSubmit: function (event) {
		event.preventDefault();
		this.checkAndSubmitPort();
	},

	handleAddPortButtonClick: function (event) {
		event.preventDefault();
		event.target.blur();

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

	handlePortInputBlur: function () {
		if (this.state.showAddPortForm && !this.getPortInputValue()) {
			this.setState({
				showAddPortForm: false
			});
		}
	},

	checkAndSubmitPort: function () {
		var port = this.getPortInputValue();
		var node;

		if (port) {
			this.openportsChannel.send('addPort', port);
			node = this.getPortInputNode();

			if (node) {
				node.value = '';
			}

			if (this.state.showAddPortForm) {
				this.setState({
					showAddPortForm: false
				});
			}
		}

		return false;
	},

	render: function () {
		var hasOpenPorts = this.hasOpenPorts();
		var hasOpenPortsClassName = hasOpenPorts ? ' has-open-ports' : '';
		var portListOrNotice = hasOpenPorts ? this.getOpenPortsList() : this.getNoOpenPortsNoticeButton();
		var portsChangedNotice = this.state.openPorts.portsChanged ? (this.getPortChangedNotice()) : null;
		var addPortButtonLabel = hasOpenPorts ? 'openPortsHandler_hasOpenPort_addPortButton_label' : 'openPortsHandler_noOpenPort_addPortButton_label';

		var showFormClassName = this.state.showAddPortForm ? ' active' : '';

		return (
			<section className={'open-ports-handler' + hasOpenPortsClassName}>
				{portsChangedNotice}

				{portListOrNotice}

				<a href='#' ref='addPortButton' className={'add-port-button' + showFormClassName} onClick={this.handleAddPortButtonClick}>
					<SvgIcon icon='plus' /> <span className='label'>{this.i18n(addPortButtonLabel)}</span>
				</a>

				<section className={'add-port-form-wrapper' + showFormClassName}>
					<form className={'add-port-form' + showFormClassName} onSubmit={this.handleFormSubmit}>
						<input 
							type='number'
							ref='portInput'
							className='add-port-input'
							onBlur={this.handlePortInputBlur}
							placeholder={this.i18n('openPortsHandler_addPortInput_placeholder')} />
					</form>
				</section>
			</section>
		)
	}
});

module.exports = OpenPortsHandler;