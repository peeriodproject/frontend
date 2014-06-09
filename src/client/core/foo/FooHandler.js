/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
var Async = require('react-async');

var FooPage = React.createClass({

	mixins: [Async.Mixin],

	getInitialStateAsync: function(cb) {
		var username = this.props.username;

		setTimeout(function () {
			cb(null, {message: 'foo page ' + username});
		}, 200);
	},

	render: function() {
		return (
			<div>
				<figure>
					<img src="https://img1.etsystatic.com/014/0/7505307/il_570xN.437006123_mtje.jpg" />
					<figcaption>
						<strong>Fig. 4.2 | </strong>Type Anatomy, an excerpt from Mark Boulton’s book<cite title="http://designingfortheweb.co.uk/book/part3/part3_chapter11.php">“Designing for the Web”</cite>
					</figcaption>
				</figure>

				<p><Link href='/'>Return</Link></p>
				<div>{this.state.message}</div>
			</div>
		)
	}
});

module.exports = FooPage;