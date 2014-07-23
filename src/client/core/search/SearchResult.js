/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var SvgIcon = require('../element/SvgIcon');

var SearchResult = React.createClass({

	handleDownloadButtonClick: function (e) {
		e.preventDefault();
	},

	render: function () {
		return (
			<li>
				{this.props.children}

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