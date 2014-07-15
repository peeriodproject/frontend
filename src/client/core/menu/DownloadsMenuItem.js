/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Link = require('react-router-component').Link;

var I18nMixin = require('../i18n/I18nMixin');
var SvgIcon = require('../element/SvgIcon');

var DownloadsMenuItem = React.createClass({

	mixins: [I18nMixin],

	getClipPath: function () {
		var l = 25;
		var left = Math.max(0, Math.min(100, (100 - l)));

		return 'polygon(0 ' + left + '%, 100% ' + left + '%, 100% 100%, 0 100%)';
	},

	render: function () {
		var styles = '-webkit-clip-path:' + this.getClipPath();

		return (
			<li>
				<h2>{ this.i18n('menu_item_downloads_title') }</h2>
				<SvgIcon icon='download' extraLayer='current' extraStyles={styles} />
				<div>
					<p>{ this.i18n('menu_item_downloads_text') }</p>
					<Link href='/folders/foobar'>
						{ this.i18n('menu_item_downloads_button_label') } »
					</Link>
				</div>
			</li>
		)
	}

});

module.exports = DownloadsMenuItem;