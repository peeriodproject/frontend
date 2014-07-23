/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var ChannelMixin = require('../socket/ChannelMixin');
var TooltipMixin = require('../tooltip/TooltipMixin');

var Download = require('./Download');

var DownloadProgressBar = React.createClass({

	_showTooltipTimeout: null,

	mixins: [
		ChannelMixin,
		TooltipMixin
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
			progress: 75.5
		}
	},

	updateShareChannelState: function (state) {
		console.log('share state', state);
		this.setState(state);
	},

	getTooltipElement: function () {
		return this.refs.tooltipTarget.getDOMNode();
	},

	getTooltipContent: function () {
		return (
			<div className='download-progress-bar-tooltip'>
				{/*<header>
					<h2>{i} Downloads</h2>
					<span>10 minutes remaining</span>
				</header>*/}
				<ul>
					{this.getDownloads()}
				</ul>
			</div>);
	},

	getDownloads: function () {
		var downloads = [];
		var downloadIds = Object.keys(this.state.downloads);
		var downloadLength = downloadIds.length;

		if (!downloadLength) {
			return downloads;
		}
		
		for (var i = 0; i < downloadLength; i++) {
			var id = downloadIds[i];
			var data = this.state.downloads[id];
			
			var download = <Download
				created={data.created}
				id={data.id}
				loaded={data.loaded}
				name={data.name}
				size={data.size}
				status={data.status} />;

			downloads.push(<li key={id}>{download}</li>);
		};

		return downloads;
	},

	hasDownloads: function () {
		return Object.keys(this.state.downloads).length ? true : false;
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
			<div className='download-progress-bar' 
				onMouseMove={this.handleOnMouseMove}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}>

				<progress 
					max='100'
					value={this.state.progress}>
				</progress>
				<div ref='tooltipTarget' className='download-tooltip-target' style={tooltipTargetStyles}></div>
			</div>
		)
	}

});

module.exports = DownloadProgressBar;