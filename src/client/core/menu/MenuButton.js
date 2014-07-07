/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var IconButton = require('../element/IconButton');

var events = require('../events/EventEmitterMixin');

var MenuButton = React.createClass({

	getInitialState: function () {
		return {
			menuIsOpen: false
		};
	},

	mixins: [
		events.mixinFor('menuClose'),
		events.mixinFor('menuOpen')
	],

	onMenuClose: function () {
		this.setState({
			menuIsOpen: false
		});
	},

	onMenuOpen: function () {
		this.setState({
			menuIsOpen: true
		});
	},

	handleClick: function () {
		var isOpen = this.state.menuIsOpen;
		var eventName = isOpen ? 'Close' : 'Open';

		// emit menu open/close event
		this['emitMenu' + eventName]();
	},

	render: function () {
		var isOpenClassName = this.state.menuIsOpen ? ' is-open' : '';

		return (
			<div className='menu-button-wrapper'>
				<IconButton 
					className={'menu-button' + isOpenClassName}
					icon='menu'
					onClick={this.handleClick} />
			</div>
		)
	}

});

module.exports = MenuButton;