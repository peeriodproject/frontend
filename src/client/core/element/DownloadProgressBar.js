/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var DownloadProgressBar = React.createClass({

	render: function () {
		return (
			<progress className='download-progress-bar' max='100' value='75'></progress>
		)
	}

});

module.exports = DownloadProgressBar;