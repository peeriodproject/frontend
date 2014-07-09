/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var DownloadProgressBar = React.createClass({

	render: function () {
		return (
			<div className='download-progress-bar'>
				<progress max='100' value='75'></progress>
			</div>
		)
	}

});

module.exports = DownloadProgressBar;