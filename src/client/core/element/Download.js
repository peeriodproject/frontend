/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Download = React.createClass({

	getDefaultProps: function () {
		return {
			progress: Math.random() * 100
		};
	},

	render: function () {
		return (
			<div className='download'>
				<header>
					Lon...ilename.txt
				</header>
				
				<progress value={this.props.progress} max='100'></progress>

				<span className='size'>512 MB of 1024 MB</span>
				<span className='speed'>10.6 Kb/s</span>
				<span className='time'>10 seconds remaining</span>
			</div>
		)
	}

});

module.exports = Download;