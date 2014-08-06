/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

var SearchResults = require('./SearchResults');
var NetworkSpeedChart = require('../chart/NetworkSpeedChart');

var SearchHandler = React.createClass({
	
	mixins: [
		ChannelMixin,
		I18nMixin,
	],

	channelNames: [
		'plugin'
	],

	getInitialState: function () {
		return {
			pluginForms: {},
			searchButtonClass: '',
			searchButtonAdvClass: ''
		};
	},

	updatePluginChannelState: function (state) {
		this.setState({
			pluginForms: state
		});
	},

	getForm: function () {
		var fieldSets = Object.keys(this.state.pluginForms);
		var forms = [];

		if (!fieldSets.length) {
			return null;
		}

		for (var i = 0, l = fieldSets.length; i < l; i++) {
			forms.push(FormFactory.create(this.state.pluginForms[fieldSets[i]]));
		}

		return forms;
	},

	render: function () {
		return (
			<section className='search-handler'>
				<SearchResults />
				{/*<NetworkSpeedChart />*/}
			</section>
		)

	}
});

module.exports = SearchHandler;