/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Router = require('react-router-component');

var Locations = Router.Locations;
var Location = Router.Location;

var SearchHeader = require('../search/SearchHeader');

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
				<main className='main has-search-header'>
					<Locations hash>
						<Location path='*' handler={SearchHeader} />
					</Locations>

					<Locations hash>
						{locations}
					</Locations>
				</main>
			);
		}
	});
};

module.exports = Router;