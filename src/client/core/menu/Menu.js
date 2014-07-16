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

		setTimeout(function () {
			window.dispatchEvent(new Event('resize'));
		}, 200);
	},

	render: function () {
		var isOpenClassName = this.state.isOpen ? ' is-open' : '';

		return (
			<section className={'menu' + isOpenClassName}>
				<nav>
					<ul>
						{this.props.children}
					</ul>
				</nav>
				<div className='menu-buttons'>
					<a href='#' ref='closeButton' onClick={this.handleCloseClick}>
						<SvgIcon icon='close' /> Close
					</a>
				</div>
			</section>
		)
	}

});

module.exports = Menu;