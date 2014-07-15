/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Link = require('react-router-component').Link;

var I18nMixin = require('../i18n/I18nMixin');
var SvgIcon = require('../element/SvgIcon');

var SharedFolderMenuItem = React.createClass({

	mixins: [I18nMixin],

	render: function () {
		return (
			<li>
				<h2>{ this.i18n('menu_item_sharedFolder_title') }</h2>
				<SvgIcon icon='folder' />
				<div>
					<p>{ this.i18n('menu_item_sharedFolder_text') }</p>
					<Link href='/folders/foobar'>
						{ this.i18n('menu_item_sharedFolder_button_label') } »
					</Link>
				</div>
			</li>
		)
	}

});

module.exports = SharedFolderMenuItem;