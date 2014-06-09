/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
var Async = require('react-async');

var Page = React.createClass({

	mixins: [Async.Mixin],

	getInitialStateAsync: function(cb) {
		setTimeout(function () {
			cb(null, {message: 'foobar'});
		}, 200);
	},

	render: function() {
		return (
			<div>
				<h1>Ridiculus Tristique</h1>
				<h2>Vulputate Fringilla Consectetur</h2>
				<h3>Fermentum Inceptos Quam Vehicula</h3>
				<h4>Commodo Parturient Vestibulum Fermentum Cras</h4>
				<h5>Commodo Parturient Vestibulum Fermentum Cras</h5>
				<h6>Commodo Parturient Vestibulum Fermentum Cras</h6>
				<p>Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla sed consectetur. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
				<p><Link href='/foo/username-state-from-url'>Login</Link></p>
				<div>{this.state.message}</div>
			</div>
		)
	}
});

module.exports = Page;