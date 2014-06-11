var React = require('react');
var Router = require('./core/router/Router')(require('./config/routes'));
window.socket = new Primus('http://localhost:3000/');
//chat = primus.channel('chat')

if (typeof window !== 'undefined') {
	window.onload = function() {
		React.renderComponent(Router(), document.body);
	};
}
