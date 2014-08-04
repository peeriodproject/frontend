/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var events = require('../events/EventEmitterMixin');

var MenuLink = require('./MenuLink');

var MenuItemMixin = require('./MenuItemMixin');
var I18nMixin = require('../i18n/I18nMixin');
var SvgIcon = require('../element/SvgIcon');

var DownloadsMenuItem = React.createClass({

	mixins: [
		MenuItemMixin,
		I18nMixin,
		events.mixinFor('averageDownloadProgress')
	],

	getInitialState: function () {
		return {
			averageDownloadProgress: 0
		}
	},

	onAverageDownloadProgress: function (progress) {
		this.setState({
			averageDownloadProgress: progress
		});
	},

	getClipPath: function () {
		var l = this.state.averageDownloadProgress;
		var left = Math.max(0, Math.min(100, (100 - l)));

		return 'polygon(0 ' + left + '%, 100% ' + left + '%, 100% 100%, 0 100%)';
	},

	render: function () {
		var styles = '-webkit-clip-path:' + this.getClipPath();

		return (
			<li onClick={this.onClick}>
				<h2>{ this.i18n('menu_item_downloads_title') }</h2>
				<SvgIcon icon='download' extraLayer='current' extraStyles={styles} />
				<div>
					<p>{ this.i18n('menu_item_downloads_text') }</p>
					<MenuLink ref='Link' href='/share'>
						{ this.i18n('menu_item_downloads_button_label') } »
					</MenuLink>
				</div>
			</li>
		)
	}

});

module.exports = DownloadsMenuItem;