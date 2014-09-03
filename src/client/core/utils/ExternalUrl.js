/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Router = require('react-router-component');

var I18nMixin = require('../i18n/I18nMixin');

var ExternalUrl = React.createClass({

	mixins: [
		I18nMixin,
		Router.NavigatableMixin
	],

	statics: {
		home: function () {
			return {
				href: 'https://peeriodproject.org',
				label: I18nMixin.i18n('externalUrl_home_label')
			}
		},
		contactUs: function () {
			return {
				href: 'https://peeriodproject.org/contact',
				label: I18nMixin.i18n('externalUrl_contactUs_label')
			}
		}
	},

	getDefaultProps: function () {
		return {};
	},

	getDataByName: function () {
		console.log(ExternalUrl[this.props.name]);

		return ExternalUrl[this.props.name] ? ExternalUrl[this.props.name]() : {};
	},

	render: function () {
		var data = this.getDataByName();

		return this.transferPropsTo(
			<Router.Link href={data.href} target='_blank'>{data.label}</Router.Link>
		);
	}

});

module.exports = ExternalUrl;