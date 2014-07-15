/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var Badge = React.createClass({

	mixins: [I18nMixin],

	getDefaultProps: function () {
		return {
			className: '',
			label: ''
		}
	},

	/*getInitialState: function () {
		return {
			label: this.props.label
		};
	},*/

	getLabel: function () {
		return this.props.label && isNaN(this.props.label) ? this.i18n(this.props.label) : this.props.label;
	},

	render: function (argument) {
		var className = this.props.className ? ' ' + this.props.className : '';

		return (
			<div className={'badge' + className}>
				{this.getLabel()}
			</div>
		)
	}
});

module.exports = Badge;