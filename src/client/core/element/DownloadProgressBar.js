/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var TooltipMixin = require('../tooltip/TooltipMixin');

var DownloadProgressBar = React.createClass({

	mixins: [
		TooltipMixin
	],

	getDefaultProps: function () {
		return {
			tooltipOpenOn: 'manual',
			enableTooltip: true
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

	handleOnMouseMove: function (event) {
		this.setState({
			tooltipTargetX: event.pageX
		});
	},

	render: function () {
		var tooltipTargetStyles = {
			left: this.state.tooltipTargetX
		};

		return (
			<div className='download-progress-bar'>
				<progress max='100' value={this.state.progress} onMouseMove={this.handleOnMouseMove}></progress>
				<div ref='tooltipTarget' className='download-tooltip-target' style={tooltipTargetStyles}></div>
			</div>
		)
	}

});

module.exports = DownloadProgressBar;