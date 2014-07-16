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
			progress: 75
		}
	},

	getTooltipElement: function () {
		return this.refs.tooltipTarget.getDOMNode();
	},

	getTooltipContent: function () {
		var downloads = [];

		for (var i = 0, l = 5; i < l; i++) {
			var download = (<li>
				<header>
					Lon...ilename.txt
				</header>
				<span>2 min left...</span>
				<progress value='30' max='100'></progress>
			</li>);

			downloads.push(download);
		}

		return (
			<div className='downloads'>
				<strong>{this.getFlooredProgress()}%</strong> – XXX time left.
				<ul>
					{downloads}
				</ul>
			</div>);
	},

	getFlooredProgress: function () {
		return Math.floor(this.state.progress);
	},

	handleOnMouseMove: function (event) {
		this.setState({
			tooltipTargetX: event.pageX
		});

		this.updateTooltipPosition();
	},

	handleMouseEnter: function (event) {
		var self = this;

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