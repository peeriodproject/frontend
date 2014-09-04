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
		home: function (inline) {
			return {
				href: 'https://peeriodproject.org',
				label: I18nMixin.i18n('externalUrl_home_label' + ExternalUrl._getInlineAppendix(inline))
			}
		},
		contactUs: function (inline) {
			console.log('contact us inline', inline);
			
			return {
				href: 'https://peeriodproject.org/contact',
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
		console.log(ExternalUrl[this.props.name]);

		return ExternalUrl[this.props.name] ? ExternalUrl[this.props.name](this.props.inline) : {};
	},

	render: function () {
		var data = this.getDataByName();

		return this.transferPropsTo(
			<Router.Link href={data.href} target='_blank'>{data.label}</Router.Link>
		);
	}

});

module.exports = ExternalUrl;