/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var Button = React.createClass({

	mixins: [I18nMixin],

	getDefaultProps: function () {
		return {
			label: 'elements_button_label',
			type: 'button',
			onClick: function () {
			}
		}
	},

	getInitialState: function () {
		return {
			label: this.i18n(this.props.label)
		};
	},

	render: function () {
		return (
			<button className='btn' type={this.props.type} onClick={this.props.onClick}>{this.state.label}</button>
		)
	}
});

module.exports = Button;