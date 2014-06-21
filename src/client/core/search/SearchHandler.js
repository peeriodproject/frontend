/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

var FormFactory = require('../form/FormFactory');
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
			pluginForms: {}
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
			<main className='main'>
				<section className='search-handler'>
					<h1>Title</h1>

					<section className='search-form'>
						{this.getForm()}
					</section>

					<NetworkSpeedChart />
				</section>
			</main>
		)

	}
});

module.exports = SearchHandler;