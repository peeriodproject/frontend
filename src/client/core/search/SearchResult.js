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

	getDefaultProps: function () {
		return {
			resultId: '',
			size: 0,
			created: 0,
			download: {},
			onDownloadStart: function () {}
			//onDownloadAbort: function () {}
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
			<li>
				<div className='download-progress'></div>
				<div className='result-content'>
					{this.props.children}
				</div>
				<footer className='meta'>
					<div className='result-meta'>
						<span className='size'>{size}</span> <span className='seperator'>{'\u00B7'}</span> <span className='created'>{created}</span>
					</div>
					<DownloadButton onClick={this.handleDownloadButtonClick} download={this.props.download} />
				</footer>
			</li>
		)
	}

});

module.exports = SearchResult;