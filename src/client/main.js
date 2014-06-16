var React = require('react');
var BackgroundHandler = require('./core/utils/BackgroundHandler');
var Router = require('./core/router/Router')(require('./config/routes'));

var DialogHandler = require('./core/dialog/DialogHandler')({
	'addFolderDialog': require('./core/dialog/AddFolderDialog')
});

// make socket available to components
window.socket = new Primus('http://localhost:3000/');

// enable the React developer tools!
window.React = React;

if (typeof window !== 'undefined') {
	window.onload = function() {
		React.renderComponent(DialogHandler(), document.getElementById('dialogHandler'));
		React.renderComponent(BackgroundHandler(), document.getElementById('backgroundHandler'));
		React.renderComponent(Router(), document.getElementById('page'));
	};
}
