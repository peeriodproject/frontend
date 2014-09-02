/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var IconButton = require('../element/IconButton');

var OpenPort = React.createClass({

	getDefaultProps: function () {
		return {
			port: 0,
			onClick: function () {}
		};
	},

	handleRemovePortClick: function (event) {
		event.preventDefault();

		this.props.onClick(this.props.port);
	},

	render: function () {
		return (
			<li>
				<span className='label'>{this.props.port}</span>
				<IconButton icon='close' onClick={this.handleRemovePortClick} />
			</li>
		)
	}

});

module.exports = OpenPort;