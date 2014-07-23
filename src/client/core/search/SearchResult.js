/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var SvgIcon = require('../element/SvgIcon');

var SearchResult = React.createClass({

	getDefaultProps: function () {
		return {
			resultId: '',
			onDownloadStart: function () {},
			onDownloadAbort: function () {}
		};
	},

	handleDownloadButtonClick: function (e) {
		e.preventDefault();

		this.props.onDownloadStart(this.props.resultId);
	},

	render: function () {
		return (
			<li>
				<div className='download-progress'></div>
				<div className='result-content'>
					{this.props.children}
				</div>
				<footer className='meta'>
					<a href='#' className='download-btn' ref='downloadButton' onClick={this.handleDownloadButtonClick}>
						<SvgIcon icon='download' /> Download
					</a>
				</footer>
			</li>
		)
	}

});

module.exports = SearchResult;