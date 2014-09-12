/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var ExternalUrl = React.createClass({

	mixins: [
		I18nMixin
	],

	statics: {
		home: function (inline) {
			return {
				href: 'https://peeriodproject.github.io',
				label: I18nMixin.i18n('externalUrl_home_label' + ExternalUrl._getInlineAppendix(inline))
			}
		},
		contactUs: function (inline) {
			return {
				href: 'https://peeriodproject.github.io/contact',
				label: I18nMixin.i18n('externalUrl_contactUs_label' + ExternalUrl._getInlineAppendix(inline))
			}
		},

		_getInlineAppendix: function (inline) {
			return inline ? '_inline' : '';
		}
	},

	getDefaultProps: function () {
		return {
			inline: false
		};
	},

	getDataByName: function () {
		return ExternalUrl[this.props.name] ? ExternalUrl[this.props.name](this.props.inline) : {};
	},

	render: function () {
		var data = this.getDataByName();

		return this.transferPropsTo(
			<a href={data.href} target='_blank'>{data.label}</a>
		);
	}

});

module.exports = ExternalUrl;