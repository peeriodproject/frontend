/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var MenuLink = require('./MenuLink');

var I18nMixin = require('../i18n/I18nMixin');
var SvgIcon = require('../element/SvgIcon');

var AppStatusMenuItem = React.createClass({

	mixins: [I18nMixin],

	render: function () {
		return (
			<li>
				<h2>{ this.i18n('menu_item_appStatus_title') }</h2>
				<SvgIcon icon='tick' />
				<div>
					<p>{ this.i18n('menu_item_appStatus_text') }</p>
				</div>
			</li>
		)
	}

});

module.exports = AppStatusMenuItem;