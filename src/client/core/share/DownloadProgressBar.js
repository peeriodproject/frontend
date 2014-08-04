/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var ChannelMixin = require('../socket/ChannelMixin');
var TooltipMixin = require('../tooltip/TooltipMixin');

var events = require('../events/EventEmitterMixin');

var DownloadProgressBarItem = require('./DownloadProgressBarItem');

var DownloadProgressBar = React.createClass({

	_showTooltipTimeout: null,

	mixins: [
		ChannelMixin,
		TooltipMixin,
		events.mixinFor('averageDownloadProgress')
	],

	channelNames: [
		'share'
	],

	initialChannelsState: { 
		downloads: {},
		destination: {
			path: '',
			error: null
		}
	},

	getDefaultProps: function () {
		return {
			tooltipOpenOn: 'manual',
			enableTooltip: true,
			tooltipDelayInMs: 500,
			tooltipPosition: 'bottom center'
		};
	},

	getInitialState: function () {
		return {
			tooltipTargetX: 0,
			averageDownloadProgress: 0
		}
	},

	componentWillUpdate: function () {

	},

	updateShareChannelState: function (state) {
		console.log('share state', state);

		state.downloads = this.getRelevantDownloadsFromState(state);
		state.averageDownloadProgress = this.getAverageDownloadProgress(state);

		this.emitAverageDownloadProgress(state.averageDownloadProgress);

		this.setState(state);
	},

	getTooltipElement: function () {
		return this.refs.tooltipTarget.getDOMNode();
	},

	getTooltipContent: function () {
		return (
			<div className='download-progress-bar-tooltip'>
				<ul>
					{this.getDownloads()}
				</ul>
			</div>);
	},

	getRelevantDownloadsFromState: function (state) {
		var downloads = [];
		var downloadIds = Object.keys(state.downloads);
		var downloadLength = downloadIds.length;

		if (!downloadLength) {
			return downloads;
		}

		for (var i = 0; i < downloadLength; i++) {
			var id = downloadIds[i];
			var data = state.downloads[id];
			
			if (['CREATED', 'REQUESTING_FILE', 'TRANSFER_STARTED'].indexOf(data.status) === -1) {
				continue;
			}

			downloads.push(data);
		}

		return downloads;
	},

	getDownloads: function () {
		var downloads = [];
		
		for (var i = 0; i < this.state.downloads.length; i++) {
			var data = this.state.downloads[i];

			var download = <DownloadProgressBarItem
				created={data.created}
				id={data.id}
				loaded={data.loaded}
				name={data.name}
				size={data.size}
				status={data.status} />;

			downloads.push(<li key={data.id}>{download}</li>);
		};

		return downloads;
	},

	getAverageDownloadProgress: function (state) {
		var progress = 0;

		state = state || this.state;
		
		if (!state.downloads.length) {
			return progress;
		}

		for (var i = 0, l = state.downloads.length; i < l; i++) {
			var download = state.downloads[i];

			progress += (download.loaded / download.size);
		}

		return (progress / state.downloads.length) * 100;
	},

	hasDownloads: function () {
		return this.state.downloads.length ? true : false;
	},

	handleOnMouseMove: function (event) {
		if (!this.hasDownloads()) {
			return;
		}

		this.setState({
			tooltipTargetX: event.pageX
		});

		this.updateTooltipPosition();
	},

	handleMouseEnter: function (event) {
		var self = this;

		if (!this.hasDownloads()) {
			return;
		}

		this._showTooltipTimeout = setTimeout(function () {
			self.openTooltip();
		}, this.props.tooltipDelayInMs);

		this.setState({
			tooltipTargetX: event.pageX
		});
	},

	handleMouseLeave: function (event) {
		if (this._showTooltipTimeout) {
			clearTimeout(this._showTooltipTimeout);
		}

		this.closeTooltip();
	},

	render: function () {
		var tooltipTargetStyles = {
			left: this.state.tooltipTargetX
		};

		return (
			<div className={'download-progress-bar' + (this.hasDownloads() ? ' has-downloads' : '')}
				onMouseMove={this.handleOnMouseMove}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}>

				<progress 
					max='100'
					value={this.state.averageDownloadProgress}>
				</progress>
				<div ref='tooltipTarget' className='download-tooltip-target' style={tooltipTargetStyles}></div>
			</div>
		)
	}

});

module.exports = DownloadProgressBar;