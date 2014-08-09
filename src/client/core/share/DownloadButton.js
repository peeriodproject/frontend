/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var SvgIcon = require('../element/SvgIcon');
var Download = require('../share/Download');

var DownloadButton = React.createClass({

	mixins: [
		I18nMixin
	],

	getDefaultProps: function () {
		return {
			download: {},
			onClick: function () {}
		};
	},

	getDownloadIcon: function () {
		var status = this.props.download.status;

		return status ? Download.getStatusGroupIcon(status) : 'download';
	},

	getStatusTitle: function () {
		var status = this.props.download.status;
		var key = status ? '_status_' + Download.transformStatus(status.toLowerCase()) : '';

		return this.i18n('SearchResult_downloadButton' + key + '_title');
	},

	render: function () {
		var icon = this.getDownloadIcon();
		var elementStatus = Download.getElementStatus(this.props.download.status);
		var disabled = this.props.download.status ? true : false;
		var loaded = this.props.download.loaded / this.props.download.size * 100;

		return (
			<div className={'download-btn-wrapper ' + elementStatus}>
				<button className='download-btn' ref='downloadButton' onClick={this.props.onClick} disabled={disabled}>
					<SvgIcon icon={this.getDownloadIcon()} /> {this.getStatusTitle()}
				</button>
				<div className='progress-bar' style={{ width: loaded + '%' }}></div>
			</div>
		)
	}
});

module.exports = DownloadButton;