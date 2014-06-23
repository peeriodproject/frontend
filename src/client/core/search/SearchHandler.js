/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

var IconButton = require('../element/IconButton');
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
			<main className='main'>
				<section className='search-handler'>
					<section className='search-form'>
						<div className='search-form-wrapper'>
							<div className='search-bar-wrapper bg-border-light'>
								<input className='search-input' type='text' placeholder='Search...' />
								<div className='search-button-wrapper'>
									<IconButton className={'search-button' + this.state.searchButtonClass} onMouseEnter={this.onSearchButtonEnter} onMouseLeave={this.onSearchButtonLeave} ref='searchButton'/>
									<IconButton 
										className={'advanced-search-button bg-border-background' + this.state.searchButtonAdvClass} 
										onClick={this.onAdvancedSearchButtonClick}
										onMouseEnter={this.onSearchButtonEnter} 
										onMouseLeave={this.onSearchButtonLeave} 
										tooltipPosition='bottom right' 
										tooltipContent={this.getAdvancedSearchList()} 
										tooltipOpenOn='click'
										tooltipOpenClass='bg-active'
										ref='advButton' />
								</div>
							</div>
						</div>
						{this.getForm()}
					</section>

					<NetworkSpeedChart />
				</section>
			</main>
		)

	}
});

module.exports = SearchHandler;