/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;

var events = require('../events/EventEmitterMixin');
var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

var Badge = require('../element/Badge');

var SearchResultsNotification = React.createClass({

	mixins: [
		I18nMixin,
		ChannelMixin,
		events.mixinFor('SearchResultsRefresh'),
		events.mixinFor('SearchResultsNotificationsEnabled'),
		events.mixinFor('SearchResultsNotificationsDisabled')
	],

	channelNames: [
		'search'
	],

	initialChannelsState: {
		isEnabled: false,
		searchStarted: false,
		totalResultsAmount: 0,
		loadedResultsAmount: 0
	},

	updateSearchChannelState: function (state) {
		var amount = state.currentResults ? state.currentResults.total : 0;

		this.setState({
			searchStarted: state.currentQuery ? true : false,
			totalResultsAmount: amount
		});

		if (!amount) {
			this.setState({
				isEnabled: false
			});
		}
	},

	onSearchResultsNotificationsEnabled: function () {
		if (!this.state.isEnabled) {
			this.setState({
				isEnabled: true
			});

			this.resetAmount();

			console.log('__ ENABLED & SYNCED __');
		}
		else {
			console.log('__ ALREADY ENABLED __');
		}
	},

	onSearchResultsNotificationsDisabled: function () {
		this.setState({
			isEnabled: false
		});

		console.log('__ DISABLED __');
	},

	onSearchResultsRefresh: function () {
		this.resetAmount();
		console.log('__ SYNCED __');
	},

	onRefreshButtonClick: function (e) {
		e.preventDefault();

		this.emitSearchResultsRefresh();
		this.resetAmount();
	},

	resetAmount: function () {
		this.setState({
			loadedResultsAmount: this.state.totalResultsAmount
		});
	},

	render: function () {
		var pendingResultsAmount = this.state.totalResultsAmount - this.state.loadedResultsAmount;
		var notification;

		console.log('bade counter', pendingResultsAmount);

		if (pendingResultsAmount > 0 && this.state.isEnabled) {
			notification = (
				<section className='search-results-notification animated flipInX'>
					<p>Search Started: {(this.state.searchStarted ? 'true' : 'false')}</p>
					
					<Badge label={pendingResultsAmount} className={'length-' + pendingResultsAmount.toString().length} /> new Results found. <a href='#' onClick={this.onRefreshButtonClick}>Refresh »</a>
				</section>
			)
		}

		return (
			<div className='search-results-notification-wrapper'>
				{notification}
			</div>
		)
	}

});

module.exports = SearchResultsNotification;