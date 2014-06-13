var React = require('react');
var Router = require('./core/router/Router')(require('./config/routes'));
window.socket = new Primus('http://localhost:3000/');

// enable the React developer tools!
window.React = React;

if (typeof window !== 'undefined') {
	window.onload = function() {
		React.renderComponent(Router(), document.getElementById('page'));
	};
}
