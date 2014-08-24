/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var moment = require('moment');

var I18nMixin = require('../i18n/I18nMixin');

var Download = require('../share/Download');
var DownloadButton = require('../share/DownloadButton');

var SearchResult = React.createClass({

	mixins: [
		I18nMixin
	],

	getDefaultProps: function () {
		return {
			resultId: '',
			size: 0,
			created: 0,
			download: {},
			destination: {},
			onDownloadStart: function () {},
			//onDownloadAbort: function () {}
			onSetDownloadDestination: function () {},
			onShowDownload: function () {}
		};
	},

	handleDownloadButtonClick: function (e) {
		e.preventDefault();

		this.props.onDownloadStart(this.props.resultId);
	},

	render: function () {
		var size = this.props.size ? Download.getSizeWithExtension(this.props.size) : '';
		var created = this.props.created ? moment(this.props.created).fromNow() : '';

		return (
			<li className='animated fadeIn'>
				<div className='download-progress'></div>
				<div className='result-content'>
					{this.props.children}
				</div>
				<footer className='meta'>
					<div className='result-meta'>
						<span className='size'>{size}</span> <span className='seperator'>{'\u00B7'}</span> <span className='created'>{created}</span>
					</div>
					<DownloadButton ref='downloadButton' 
						onClick={this.handleDownloadButtonClick} 
						onSetDownloadDestination={this.props.onSetDownloadDestination}
						onShowDownload={this.props.onShowDownload}
						download={this.props.download} 
						destination={this.props.destination} />
				</footer>
			</li>
		)
	}

});

module.exports = SearchResult;