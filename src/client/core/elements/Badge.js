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
		return (
			<div className="badge bg-hover">
				{this.getLabel()}
			</div>
		)
	}
});

module.exports = Badge;