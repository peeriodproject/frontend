/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var DownloadMixin = require('./DownloadMixin');

var DownloadProgressBarItem = React.createClass({

	mixins: [
		DownloadMixin
	],

	render: function () {
		if (!this.props.status) {
			return null;
		}

		return (
			<div className='progress-bar-item'>
				<header>
					{this.props.name}
				</header>
				
				<progress value={this.getProgress() * 100} max='100'></progress>

				<span className='size'>
					{this.type.getSizeWithExtension(this.props.loaded)} of {this.type.getSizeWithExtension(this.props.size)}
				</span>
				<span className='speed'>{this.type.getSizeWithExtension(this.state.averageSpeed)}/s</span>
				<span className='time'>{this.getTimeLeft()}</span>
			</div>
		)
	}

});

module.exports = DownloadProgressBarItem;