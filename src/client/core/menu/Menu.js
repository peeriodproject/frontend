/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var SvgIcon = require('../element/SvgIcon');

var events = require('../events/EventEmitterMixin');

var Menu = React.createClass({

	mixins: [
		events.mixinFor('menuClose'),
		events.mixinFor('menuOpen')
	],

	getInitialState: function () {
		return {
			isOpen: false
		};
	},

	onMenuClose: function () {
		this.setState({
			isOpen: false
		});
	},

	onMenuOpen: function () {
		this.setState({
			isOpen: true
		});
	},

	handleCloseClick: function (event) {
		event.preventDefault();
		
		this.emitMenuClose();
	},

	render: function () {
		var isOpenClassName = this.state.isOpen ? ' is-open' : '';

		return (
			<section className={'menu' + isOpenClassName}>
				<nav>
					<ul>
						<li>
							<h2>App Status</h2>
							<SvgIcon icon='tick' />
							<div>
								<p>Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
								<a href=''>
									<SvgIcon icon='close' /> Close
								</a>
							</div>
						</li>
						<li>
							<h2>Shared Folders</h2>
							<SvgIcon icon='tick' />
							<div>
								<p>Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
								<a href=''>
									<SvgIcon icon='close' /> Close
								</a>
							</div>
						</li>
						<li>
							<h2>Downloads</h2>
							<SvgIcon icon='tick' />
							<div>
								<p>Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
								<a href=''>
									<SvgIcon icon='close' /> Close
								</a>
							</div>
						</li>
					</ul>
				</nav>
				<div className='menu-buttons'>
					<a href='' ref='closeButton' onClick={this.handleCloseClick}>
						<SvgIcon icon='close' /> Close
					</a>
				</div>
			</section>
		)
	}

});

module.exports = Menu;