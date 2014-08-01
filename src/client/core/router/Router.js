/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var ReactRouter = require('react-router-component');

var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;

var SearchHeader = require('../search/SearchHeader');

/**
 * The router acts as the main entrypoint to the application
 *
 * @param {[type]} routes An array of {path: string handler: React.Class}
 */
var Router = function (routes) {
	return React.createClass({

		onBeforeNavigation: function () {
			console.log(arguments);
		},

		onNavigation: function () {
			console.log(arguments);
		},

		render: function() {
			var locations = [];

			for (var i in routes) {
				var route = routes[i];

				locations.push(<Location path={route.path} handler={route.handler} />);
			}

			var locationRouter = (
				<Locations hash onBeforeNavigation={this.onBeforeNavigation} onNavigation={this.onNavigation}>
					{locations}
				</Locations>
			)

			//console.log(locationRouter.getRouterState());
			console.log(locationRouter);

			return (
				<main className='main has-search-header'>
					<Locations hash>
						<Location path='*' handler={SearchHeader} />
					</Locations>

					{locationRouter}
				</main>
			);
		}
	});
};

module.exports = Router;