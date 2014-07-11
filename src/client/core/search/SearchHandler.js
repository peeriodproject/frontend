/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

var SearchHeader = require('./SearchHeader');

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

	onSearchButtonEnter: function (e) {
		this.setState({
			searchButtonClass: ' bg-hover',
			searchButtonAdvClass: ' bg-hover'
		});
	},

	onSearchButtonLeave: function (e) {
		if (!this.refs.advButton.tooltipIsOpen()) {
			this.setState({
				searchButtonClass: '',
				searchButtonAdvClass: ''
			});
		}
	},

	getAdvancedSearchList: function () {
		return React.DOM.div({}, 'foobario');
		//return (<div><h1>Foobario</h1></div>)
	},

	onAdvancedSearchButtonClick: function (e) {
		/*if (this.state.searchButtonAdvClass.indexOf('bg-active') === -1) {
			this.setState({
				searchButtonAdvClass: ' bg-active'
			});
		}
		else {
			this.setState({
				searchButtonAdvClass: this.state.searchButtonAdvClass.replace('bg-active', '')
			});
		}*/
	},

	render: function () {
		return (
			<main className='main has-search-form'>
				<SearchHeader />
				<div className="dummy"></div>
				{/*<NetworkSpeedChart />*/}
			</main>
		)

	}
});

module.exports = SearchHandler;