/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;

var Folder = React.createClass({
	render: function () {
		return (
			<section className="folder">
				<h3>{this.props.name}</h3>
				<p>{this.props.path}</p>
			</section>
		)
	}
});

module.exports = Folder;