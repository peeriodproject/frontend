/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var ConnectionFailedPage = React.createClass({

	onReconnectClick: function (event) {
		event.preventDefault();

		window.location.reload();
	},

	render: function () {
		return (
			<main className='main'>
				<section className='page connection-failed'>
					<div className='wrapper'>
						<article>
							<header>
								<h1>Connection Failed</h1>
							</header>
							<p>
								Vestibulum id ligula porta felis euismod semper. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.
							</p>

							<a href='#' className='btn' onClick={this.onReconnectClick}>
								Reconnect
							</a>
						</article>
					</div>
				</section>
			</main>
		)
	}

});

module.exports = ConnectionFailedPage;