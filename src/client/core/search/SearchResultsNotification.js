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

		if (!amount || amount < 0) {
			this.setState({
				isEnabled: false
			});
		}
	},

	onSearchResultsNotificationsEnabled: function (frozenAmount) {
		if (this.state.isEnabled) {
			return;
		}
		
		this.setState({
			isEnabled: true
		});

		this.resetAmount(frozenAmount);
	},

	onSearchResultsNotificationsDisabled: function () {
		this.setState({
			isEnabled: false
		});
	},

	onSearchResultsRefresh: function () {
		this.resetAmount();
	},

	onRefreshButtonClick: function (e) {
		e.preventDefault();

		this.emitSearchResultsRefresh();
		this.resetAmount();
	},

	resetAmount: function (frozenAmount) {
		var amount = frozenAmount || this.state.totalResultsAmount;

		this.setState({
			loadedResultsAmount: amount
		});
	},

	render: function () {
		var pendingResultsAmount = this.state.totalResultsAmount - this.state.loadedResultsAmount;
		var notification;

		if (pendingResultsAmount > 0 && this.state.isEnabled) {
			notification = (
				<section className='search-results-notification animated flipInX'>
					{this.i18n('SearchResultsNotification_newResultsFound_content', [
						<Badge label={pendingResultsAmount} className={'status-valid length-' + pendingResultsAmount.toString().length} />
					])} <a href='#' onClick={this.onRefreshButtonClick}>{this.i18n('SearchResultsNotification_newResultsFound_refreshButton_label')} »</a>
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