var React = require('react');
//var BackgroundHandler = require('./core/utils/BackgroundHandler');
var ConnectionFailedPage = require('./core/page/ConnectionFailedPage');
var Router = require('./core/router/Router')(require('./config/routes'));

var DialogHandler = require('./core/dialog/DialogHandler')({
	'addFolderDialog': require('./core/dialog/AddFolderDialog')
});

window.App = {
	_running: false,
	_windowLoaded: false,
	_connected: false,
	_maxReconnectAttempts: 1,

	connect: function (attempts) {
		attempts = attempts || 0;

		console.log('Trying to connect to the backend...');

		try {
			attempts++;

			// make socket available to components
			var socket = new Primus('http://localhost:7474/');

			socket.on('reconnect', function () {
				console.log('Reconnect attempt started');
			});

			socket.on('reconnecting', function (opts) {
				console.log('Reconnecting in %d ms', opts.timeout);
				console.log('This is attempt %d out of %d', opts.attempt, opts.retries);
			});

			socket.on('end', function () {
				App.connectionFailed();
				//console.log('Connection closed');
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

	start: function () {
		if (this._running || !this._windowLoaded || !this._connected) {
			return;
		}

		React.renderComponent(DialogHandler(), document.getElementById('dialogHandler'));
		//React.renderComponent(BackgroundHandler(), document.getElementById('backgroundHandler'));
		React.renderComponent(Router(), document.getElementById('page'));

		this._running = true;
	},

	connectionFailed: function () {
		React.renderComponent(ConnectionFailedPage(), document.getElementById('page'));
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
