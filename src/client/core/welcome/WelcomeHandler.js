/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var WelcomeHandler = React.createClass({

	mixins: [
		I18nMixin
	],

	componentDidMount: function () {
		window.localStorage.setItem('hasSeenWelcomeNotice', true);
	},

	render: function () {
		return (
			<section className='welcome-handler'>
				<header>
					<h1>{this.i18n('welcome_title')}</h1>
				</header>

				<p>{this.i18n('welcome_description')}</p>
			</section>
		)
	}
});

module.exports = WelcomeHandler;