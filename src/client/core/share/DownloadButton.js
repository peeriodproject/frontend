/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var SvgIcon = require('../element/SvgIcon');
var Download = require('../share/Download');
var DownloadButtonErrorTourMixin = require('../share/DownloadButtonErrorTourMixin');

var DownloadButton = React.createClass({

	mixins: [
		I18nMixin,
		DownloadButtonErrorTourMixin
	],

	getDefaultProps: function () {
		return {
			className: '',
			download: {},
			destination: {},
			error: null,
			onClick: function () {},
			onSetDownloadDestination: function () {},
			onShowDownload: function () {}
		};
	},

	componentWillReceiveProps: function (nextProps) {
		nextProps.error = null;

		// we have a destination error and no download was stated jet.
		if (nextProps.destination.error && !nextProps.download.status) {
			nextProps.error = nextProps.destination.error.code;
		}
		// running download status code is inalid
		else if (Download.isInStatusGroup('invalid', nextProps.download.status)) {
			nextProps.error = nextProps.download.status;
		}
	},

	getDownloadIcon: function () {
		var status = this.props.download.status;

		return status ? Download.getStatusIcon(status) : 'download';
	},

	getStatusTitle: function () {
		var status = this.props.download.status;
		var key = status ? '_status_' + Download.transformStatus(status.toLowerCase()) : '';

		return this.i18n('SearchResult_downloadButton' + key + '_title');
	},

	onClick: function (event) {
		var disabled = this.props.download.status ? true : false;
		
		if (!disabled) {
			this.showDelayedErrorTour();
			this.props.onClick(event);
		}
	},

	render: function () {
		var icon = this.getDownloadIcon();
		var elementStatus = Download.getElementStatus(this.props.download.status);
		var disabled = this.props.download.status ? true : false;
		var loaded = this.props.download.loaded / this.props.download.size * 100;
		var target = null;
		
		loaded = isNaN(loaded) ? 0 : loaded;
		
		try {
			target = this.getDOMNode()
		} catch (e) {
		}

		return (
			<div className={'download-btn-wrapper ' + elementStatus + this.props.className}>
				<button className='download-btn' ref='downloadButton' onClick={this.onClick} disabled={disabled}>
					<SvgIcon icon={this.getDownloadIcon()} /> {this.getStatusTitle()}
					<div className='progress-bar' style={{ width: loaded + '%' }}></div>
				</button>
			</div>
		)
	}
});

module.exports = DownloadButton;