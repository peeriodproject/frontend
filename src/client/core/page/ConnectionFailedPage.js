/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var SvgIcon = require('../element/SvgIcon');

var ConnectionFailedPage = React.createClass({

	_reconnectTimeout: null,

	mixins: [
		I18nMixin
	],

	componentWillMount: function () {
		var _this = this;

		this.checkConnection();
	},

	componentWillUnmount: function () {
		this.clearReconnectInterval();
	},

	getDefaultProps: function () {
		return {
			url: '',
			reconnectInterval: 1000,
			onReconnect: function () {}
		};
	},

	onReconnectClick: function (event) {
		event.preventDefault();

		this.clearReconnectInterval();
		window.location.reload();
	},

	checkConnection: function () {
		var _this = this;

		if (!this.props.url) {
			return;
		}

		this._reconnectTimeout = setTimeout(function () {
			/*$.ajax({
				type: 'HEAD',
				url: _this.props.url,
				success: function(){
					//console.log('got a connection!');
					_this.props.onReconnect();
				},
				error: function() {
					//console.log('can not connect to backend');
					_this.checkConnection();
				}
			});*/

			// todo send request to the backend
		}, this.props.reconnectInterval);
	},

	clearReconnectInterval: function () {
		if (this._reconnectTimeout) {
			clearTimeout(this._reconnectTimeout);
			this._reconnectTimeout = null;
		}
	},

	render: function () {
		return (
			<main className='main'>
				<section className='page connection-failed'>
					<div className='wrapper'>
						<article>
							<img className='app-icon' src='/assets/icons/icon128.png' alt={this.i18n('appName') + ' – ' + this.i18n('appTagline')} />
							<header>
								<h1>{ this.i18n('page_connectionFailed_title') }</h1>
							</header>
							<p>{ this.i18n('page_connectionFailed_text') }</p>

							<a href='#' className='btn' onClick={this.onReconnectClick}>
								{this.i18n('page_connectionFailed_retryButton_title')}
							</a>
						</article>
					</div>
				</section>
			</main>
		)
	}

});

module.exports = ConnectionFailedPage;