/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var MenuLink = require('./MenuLink');

var MenuItemMixin = require('./MenuItemMixin');
var I18nMixin = require('../i18n/I18nMixin');
var SvgIcon = require('../element/SvgIcon');

var SharedFolderMenuItem = React.createClass({

	mixins: [
		MenuItemMixin,
		I18nMixin
	],

	render: function () {
		return (
			<li onClick={this.onClick}>
				<h2>{ this.i18n('menu_item_sharedFolder_title') }</h2>
				<SvgIcon icon='folder' />
				<div>
					<p>{ this.i18n('menu_item_sharedFolder_text') }</p>
					<MenuLink ref='Link' href='/folders'>
						{ this.i18n('menu_item_sharedFolder_button_label') } »
					</MenuLink>
				</div>
			</li>
		)
	}

});

module.exports = SharedFolderMenuItem;