/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Router = require('react-router-component');

var events = require('../events/EventEmitterMixin');

var MenuLink = React.createClass({

	mixins: [
		events.mixinFor('menuClose'),
		Router.NavigatableMixin
	],

	closeMenu: function () {
		this.emitMenuClose();
	},

	render: function() {
		return this.transferPropsTo(Router.Link({
			className: className,
			onClick: this.closeMenu
		}, this.props.children));
	}

});

module.exports = MenuLink;