/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Button = React.createClass({

	getInitialState: function () {
		return {
			label: this.props.label || 'Button'
		};
	},

	getType: function () {
		return this.props.type || 'button';
	},

	render: function () {
		return (
			<button type={this.getType()} onClick={this.props.onClick}>{this.state.label}</button>
		)
	}
});

module.exports = Button;