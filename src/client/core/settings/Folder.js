/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
var Badge = require('../elements/Badge');
var Path = require('../elements/Path');

var Folder = React.createClass({
	getDefaultProps: function () {
		return {
			name: '',
			path: '',
			items: 0,
			status: 'idle'
		}
	},

	render: function () {
		return (
			<section className={"folder status-" + this.props.status}>
				<h2>{this.props.name}</h2>
				<Path path={this.props.path} />
				
				<div className="badge-wrapper">
					<Badge label={this.props.items} />
				</div>
			</section>
		)
	}
});

module.exports = Folder;