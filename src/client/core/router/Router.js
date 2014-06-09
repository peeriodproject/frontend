/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;

/**
 * The router acts as the main entrypoint to the application
 *
 * @param {[type]} routes An array of {path: string handler: React.Class}
 */
var Router = function (routes) {
	return React.createClass({
		render: function() {
			var locations = [];

			for (var i in routes) {
				var route = routes[i];

				locations.push(<Location path={route.path} handler={route.handler} />);
			}

			return (
				<Locations hash>
					{locations}
				</Locations>
			);
		}
	});
};

module.exports = Router;