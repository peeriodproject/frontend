/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var MenuLink = require('./MenuLink');

var ChannelMixin = require('../socket/ChannelMixin');
var MenuItemMixin = require('./MenuItemMixin');
var I18nMixin = require('../i18n/I18nMixin');
var SvgIcon = require('../element/SvgIcon');

var AppStatusMenuItem = React.createClass({

	channelNames: [
		'protocol'
	],

	mixins: [
		ChannelMixin,
		MenuItemMixin,
		I18nMixin
	],

	initialChannelsState: {
		hasCircuits: false
	},

	updateProtocolChannelState: function (state) {
		var hasCircuits = state.numOfHydraCircuits && state.numOfHydraCircuits > 0 ? true : false;

		this.setState({
			hasCircuits: hasCircuits
		});
	},

	render: function () {
		var icon = this.state.hasCircuits ? 'tick' : 'warning';

		return (
			<li onClick={this.onClick}>
				<h2>{ this.i18n('menu_item_appStatus_title') }</h2>
				<SvgIcon icon={icon} />
				<div>
					<p>{ this.i18n('menu_item_appStatus_text') }</p>
					<MenuLink ref='Link' href='/status'>
						{ this.i18n('menu_item_appStatus_button_label') } »
					</MenuLink>
				</div>
			</li>
		)
	}

});

module.exports = AppStatusMenuItem;