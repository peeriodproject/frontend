/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
//var BackgroundHandler = require('./core/utils/BackgroundHandler');
var ConnectionFailedPage = require('./core/page/ConnectionFailedPage');
var ConnectionLostNotice = require('./core/utils/ConnectionLostNotice');

var Router = require('./core/router/Router')(require('./config/routes'));
var Footer = require('./core/element/Footer');

var I18nMixin = require('./core/i18n/I18nMixin');

var DialogHandler = require('./core/dialog/DialogHandler')({
	'addFolderDialog': require('./core/dialog/AddFolderDialog')
});

window.App = {
	_running: false,
	_windowLoaded: false,
	_connected: false,
	_maxReconnectAttempts: 1,
	_backendUrl: 'http://localhost:7474/',

	connect: function (attempts) {
		var _this = this;

		attempts = attempts || 0;

		try {
			attempts++;

			// make socket available to components
			var socket = new Primus(this._backendUrl);

			socket.on('end', function () {
				App.connectionFailed();
			});

			window.socket = socket;

			this._connected = true;

			this.start();
		}
		catch (e) {
			if (attempts <= this._maxReconnectAttempts) {
				setTimeout(function () {
					App.connect(attempts);
				}, 1000);
			}
			else {
				this.connectionFailed();
			}
		}
	},

	checkFirstRun: function () {
		if (!window.localStorage.getItem('hasSeenWelcomeNotice')) {
			window.history.pushState({}, '', '#/welcome');
		}
		else if (window.location.hash.indexOf('/welcome') !== -1) {
			window.history.pushState({}, '', '#/');
		}
	},

	setTitle: function () {
		document.title = I18nMixin.i18n('appName');
	},

	start: function () {
		if (this._running || !this._windowLoaded || !this._connected) {
			return;
		}

		this.setTitle();
		this.checkFirstRun();

		//React.renderComponent(DialogHandler(), document.getElementById('dialogHandler'));
		//React.renderComponent(BackgroundHandler(), document.getElementById('backgroundHandler'));
		React.renderComponent(ConnectionLostNotice(), document.getElementById('page-overlay'));
		React.renderComponent(Router(), document.getElementById('page'));
		React.renderComponent(Footer(), document.getElementById('page-footer'));

		this._running = true;
	},

	connectionFailed: function () {
		React.renderComponent(ConnectionFailedPage({ url: this._backendUrl, onReconnect: this.start() }), document.getElementById('page'));
	}

};

App.connect();

if (typeof window !== 'undefined') {
	// enable the React developer tools!
	window.React = React;

	window.onload = function() {
		App._windowLoaded = true;

		App.start();
	};
}
