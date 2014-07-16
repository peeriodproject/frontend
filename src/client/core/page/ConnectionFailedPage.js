/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var ConnectionFailedPage = React.createClass({

	mixins: [
		I18nMixin
	],

	onReconnectClick: function (event) {
		event.preventDefault();

		window.location.reload();
	},

	render: function () {
		return (
			<main className='main'>
				<section className='page connection-failed'>
					<div className='wrapper'>
						<article>
							<header>
								<h1>{ this.i18n('page_connectionFailed_title') }</h1>
							</header>
							<p>{ this.i18n('page_connectionFailed_text') }</p>

							<a href='#' className='btn' onClick={this.onReconnectClick}>
								Reconnect
							</a>
						</article>
					</div>
				</section>
			</main>
		)
	}

});

module.exports = ConnectionFailedPage;