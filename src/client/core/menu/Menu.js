/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');
var events = require('../events/EventEmitterMixin');

var SvgIcon = require('../element/SvgIcon');

var Menu = React.createClass({

	mixins: [
		I18nMixin,
		events.mixinFor('menuClose'),
		events.mixinFor('menuOpen')
	],

	getInitialState: function () {
		return {
			isOpen: false,
			locationClassName: ''
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
			<section className={'menu' + isOpenClassName + this.props.locationClassName}>
				<nav>
					<ul>
						{this.props.children}
					</ul>
				</nav>
				<div className='menu-buttons'>
					<a href='#' ref='closeButton' onClick={this.handleCloseClick}>
						<SvgIcon icon='close' /> {this.i18n('menu_closeButton_label')}
					</a>
				</div>
			</section>
		)
	}

});

module.exports = Menu;