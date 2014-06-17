var React = require('react');
var BackgroundHandler = require('./core/utils/BackgroundHandler');
var Router = require('./core/router/Router')(require('./config/routes'));

var DialogHandler = require('./core/dialog/DialogHandler')({
	'addFolderDialog': require('./core/dialog/AddFolderDialog')
});

// make socket available to components
var socket = new Primus('http://localhost:3000/');

socket.on('reconnect', function () {
	console.log('Reconnect attempt started');
});

socket.on('reconnecting', function (opts) {
	console.log('Reconnecting in %d ms', opts.timeout);
	console.log('This is attempt %d out of %d', opts.attempt, opts.retries);
});

socket.on('end', function () {
	console.log('Connection closed');
});

window.socket = socket;

// enable the React developer tools!
window.React = React;

if (typeof window !== 'undefined') {
	window.onload = function() {
		React.renderComponent(DialogHandler(), document.getElementById('dialogHandler'));
		React.renderComponent(BackgroundHandler(), document.getElementById('backgroundHandler'));
		React.renderComponent(Router(), document.getElementById('page'));
	};
}
