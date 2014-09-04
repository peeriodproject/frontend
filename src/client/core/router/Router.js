/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var ReactRouter = require('react-router-component');

var NotFound = ReactRouter.NotFound
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;

var MenuButton = require('../menu/MenuButton');
var SearchHeader = require('../search/SearchHeader');
var WelcomeHandler = require('../welcome/WelcomeHandler');

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

			//locations.push(<NotFound handler={WelcomeHandler} />);

			var locationRouter = (
				<Locations hash onBeforeNavigation={this.firstRunCheck}>
					{locations}
				</Locations>
			)

			return (
				<main className='main has-search-header'>
					<MenuButton />

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