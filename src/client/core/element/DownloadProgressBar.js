/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var TooltipMixin = require('../tooltip/TooltipMixin');

var DownloadProgressBar = React.createClass({

	_showTooltipTimeout: null,

	mixins: [
		TooltipMixin
	],

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

	getTooltipElement: function () {
		return this.refs.tooltipTarget.getDOMNode();
	},

	getTooltipContent: function () {
		var downloads = [];
		var i = 0;

		this.props.children.map(function(child) {
          downloads.push(<li key={i}>{child}</li>);
          i++;
        });

		return (
			<div className='download-progress-bar-tooltip'>
				<header>
					<h2>{i} Downloads</h2>
					<span>10 minutes remaining</span>
				</header>
				<ul>
					{downloads}
				</ul>
			</div>);
	},

	getFlooredProgress: function () {
		return Math.floor(this.state.progress);
	},

	hasDownloads: function () {
		return this.props.children.length ? true : false;
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