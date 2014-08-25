/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var DownloadMixin = require('./DownloadMixin');
var I18nMixin = require('../i18n/I18nMixin');

var DownloadProgressBarItem = React.createClass({

	mixins: [
		DownloadMixin
	],

	getStatusDescription: function () {
		return this.i18n('download_status_' + Download.transformStatus(this.props.status.toLowerCase()));
	},

	render: function () {
		var descriptionOrTime = this.props.loaded ? this.getTimeLeft() : this.getStatusDescription();

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
					{DownloadProgressBarItem.getSizeWithExtension(this.props.loaded)} of {DownloadProgressBarItem.getSizeWithExtension(this.props.size)}
				</span>
				<span className='speed'>{DownloadProgressBarItem.getSizeWithExtension(this.state.averageSpeed)}/s</span>
				<span className='time'>{descriptionOrTime}</span>
			</div>
		)
	}

});

module.exports = DownloadProgressBarItem;