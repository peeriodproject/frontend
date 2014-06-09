var React = require('react');
var Router = require('./core/router/Router')(require('./config/routes'));

if (typeof window !== 'undefined') {
	window.onload = function() {
		React.renderComponent(Router(), document.body);
	};
}
