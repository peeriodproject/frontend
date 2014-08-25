/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var events = require('../events/EventEmitterMixin');

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');
var DownloadDestinationDropzoneMixin = require('../share/DownloadDestinationDropzoneMixin');

var FeatureManager = require('../element/FeatureManager');
var Badge = require('../element/Badge');
var SvgIcon = require('../element/SvgIcon');
var SearchResult = require('./SearchResult');
var NetworkLoader = require('../element/NetworkLoader');

var resultTemplates = {
	text: require('../resultTemplates/TextResult')
};

var SearchResults = React.createClass({

	mixins: [
		ChannelMixin,
		I18nMixin,
		DownloadDestinationDropzoneMixin,
		events.mixinFor('SearchResultsRefresh'),
		events.mixinFor('SearchResultsNotificationsEnabled'),
		events.mixinFor('SearchResultsNotificationsDisabled')
	],

	channelNames: [
		'search',
		'share',
		'folderdropzone'
	],

	getDefaultProps: function () {
		return {
			hideOverlayTimeoutDelay: 15000,
			resultsThresholdToFreeze: 7
		}
	},

	getInitialState: function () {
		return {
			query: null,
			results: null,
			frozenResults: null,
			downloads: {},
			destination: {},
			overlayTimedOut: false,
			resultErrors: {}
		}
	},

	componentWillMount: function () {
		this._overlayTimeout = null;
	},

	componentWillUnmount: function () {
		if (this._overlayTimeout) {
			clearTimeout(this._overlayTimeout);
		}
	},

	getHitTemplate: function (hit) {
		var fields = hit.fields || {};

		return fields._template ? fields._template : 'text';
	},

	getDownload: function (downloadId) {
		return this.state.downloads[downloadId] || {};
	},

	getResultError: function (resultId) {
		return this.state.resultErrors[resultId] ? this.state.resultErrors[resultId] : null;
	},

	handleDownloadStart: function (resultId) {
		console.log('Sending download down the wire');
		var _this = this;
		this.shareChannel.send('addDownload', resultId, function (err) {
			var resultErrors = _this.state.resultErrors;
			if (err) {
				resultErrors[resultId] = err;

				_this.setState({
					resultErrors: resultErrors
				});
			}
			else if (resultErrors[resultId]) {
				resultErrors[resultId] = null;
				delete resultErrors[resultId];

				_this.setState({
					resultErrors: resultErrors
				});
			}
		});
	},

	handleSetDownloadDestination: function (event) {
		event.preventDefault();

		this.openDropzoneWindow();
	},

	handleShowDownload: function (id) {
		//alert('show download id: ' + id);
		this.shareChannel.send('showDownload', id);
	},

	freezeResults: function (state, trimResults) {
		var frozenResults;

		state = state || this.state;

		if (trimResults) {
			frozenResults = {
				total: this.props.resultsThresholdToFreeze,
				hits: state.results.hits.splice(0, this.props.resultsThresholdToFreeze)
			};
		}
		else {
			frozenResults = state.results;
		}

		this.setState({
			frozenResults: frozenResults
		});
	},

	handleDownloadAbort: function (resultId) {
		this.shareChannel.send('removeDownload', resultId);
	},

	hideOverlay: function (ignoreResults) {
		console.log('_ hiding overlay _');
		if (this._overlayTimeout) {
			clearTimeout(this._overlayTimeout);
			this._overlayTimeout = null;
		}

		this.setState({
			overlayIsActive: false
		});

		if (!ignoreResults) {
			this.freezeResults();
			this.emitSearchResultsNotificationsEnabled();
		}
	},

	freezingPoint: function (nextState) {
		var trimResults = this.state.frozenResults && this.state.frozenResults.total < this.props.resultsThresholdToFreeze ? true : false;

		console.log('below freezing. needs refresh', trimResults);
		if (this.state.frozenResults) console.log(this.state.frozenResults.total);

		if (!this.state.frozenResults || this.state.frozenResults.total < this.props.resultsThresholdToFreeze) {
			console.log('___ FREEZE ___');
			console.log(nextState);
			this.freezeResults(nextState, trimResults);
		}

		this.hideOverlay(true);
	},

	onSearchResultsRefresh: function () {
		this.freezeResults();
		this.hideOverlay();
	},

	updateSearchChannelState: function (state) {
		var _this = this;
		var nextState = {
			query: state.currentQuery,
			status: state.currentQueryStatus,
			results: state.currentResults || {}
		};

		console.log(state);

		if (!nextState.results || (nextState.query !== this.state.query && nextState.status === 'CREATED')) {
			nextState.frozenResults = null;
		}

		if (this.state.overlayTimedOut && ((nextState.results && nextState.results.total) || nextState.status === 'COMPLETE')) {
				this.hideOverlay();
			}

		// results amount is above freezing. -> updating results
		if (nextState.results && nextState.results.total) {
			console.log('has results', nextState.status);
			//nextState.frozenResults = nextState.results;

			if (nextState.results.total < this.props.resultsThresholdToFreeze) {
				console.log('above freezing, setting:', nextState.results.total);
				this.freezeResults(nextState);
				//nextState.frozenResults = nextState.results;
				//this.emitSearchResultsRefresh();
				/*if (nextState.results.total === this.props.resultsThresholdToFreeze) {
					this.freezingPoint(nextState);
					this.emitSearchResultsNotificationsEnabled();
				}*/
			}
			else if (nextState.results.total >= this.props.resultsThresholdToFreeze && (this.state.overlayIsActive || nextState.status !== 'CREATED')) {
				console.log('- - - - - - - - - - -');
				this.freezingPoint(nextState);
				this.emitSearchResultsNotificationsEnabled();
				console.log('- - - - - - - - - - -');

				/*if (!this.state.isFrozen) {
					this.emitSearchResultsNotificationsEnabled();
					this.setState({
						isFrozen: true
					});
				}*/

				if (!this.state.frozenResults) {
					this.emitSearchResultsRefresh();
				}
			}
		}
		/*if (nextState.results && nextState.results.total < this.props.resultsThresholdToFreeze) {
			console.log('above freezing');
			nextState.frozenResults = nextState.results;
		}
		// hide the overlay and freeze the results.
		else if (nextState.results && nextState.results.total >= this.props.resultsThresholdToFreeze && this.state.overlayIsActive) {
			this.hideOverlay();
		}*/
		// activate overlay whenever a new query started
		else if (nextState.query && this.state.query !== nextState.query && nextState.status !== 'COMPLETE') {
			if (this._overlayTimeout) {
				clearTimeout(this._overlayTimeout);
			}

			console.log('setting overlay timeout');
			this._overlayTimeout = setTimeout(function () {
				console.log('clearing overlay');
				//_this.hideOverlay()
				_this.setState({
					overlayTimedOut: true
				});

				_this._overlayTimeout = null;
			}, this.props.hideOverlayTimeoutDelay);
			this.emitSearchResultsNotificationsDisabled();

			nextState.overlayIsActive = true;
			nextState.overlayTimedOut = false;
		}
		else {
			nextState.frozenResults = null;
		}

		this.setState(nextState);

		console.log('channel update!', this.state.results.total);
		JSON.stringify(this.state.results.hits);
	},

	updateShareChannelState: function (state) {
		console.log(state);

		this.setState({
			downloads: state ? state.downloads : [],
			destination: state.destination
		});
	},

	render: function () {
		var overlayIsActiveClassName = this.state.overlayIsActive ? ' active' : '';
		var hasResults = false;
		var hasResultsAmount = 0;
		var results = {};
		var resultList;
		var noSearchStartedNotice;
		var noResultsFoundNotice;
		var overlayNoticeTitle;
		var overlayNoticeContent;
		var overlayLoader;

		// build templates
		if (this.state.frozenResults && this.state.frozenResults.total) {
			hasResults = true;
			hasResultsAmount = this.state.frozenResults.total;

			for (var i = 0, l = this.state.frozenResults.hits.length; i < l; i++) {
				var hit = this.state.frozenResults.hits[i];
				var itemStats = hit.response._source && hit.response._source.itemStats ? hit.response._source.itemStats : null;
				var size = itemStats ? itemStats.size : 0;
				var created = itemStats ? itemStats.ctime : null;

				var template = resultTemplates[this.getHitTemplate(hit)];
				
				if (!template) {
					console.warn('No template found. Falling back to text!');
					template = resultTemplates['text'];
				}

				results[hit.response._id] = (
					<SearchResult
						ref={'searchResult-' + hit.response._id}
						resultId={hit.response._id}
						created={created}
						size={size}
						destination={this.state.destination}
						download={this.getDownload(hit.response._id)}
						onDownloadStart={this.handleDownloadStart}
						onDownloadAbort={this.handleDownloadAbort}
						onSetDownloadDestination={this.handleSetDownloadDestination}
						onShowDownload={this.handleShowDownload}>
							<template fields={hit.fields} response={hit.response} />
					</SearchResult>
				)
			}
		}

		// show results
		if (hasResults) {
			resultList = (
				<ul className='search-results-list'>
					{results}
				</ul>
			)
		}
		// no running query. show some tips and features
		/*else if (!(this.state.query || this.state.submitted) && this.gotInitialState('search')) {
			noSearchStartedNotice = (
				<div className='search-results-not-started-notice'>
					<FeatureManager getRandomFeature={true} />
				</div>
			)
		}*/
		// completed without results. show a "nothing found" notice
		else if (this.state.status === 'COMPLETE') {
			noResultsFoundNotice = (
				<div className='search-results-not-found-wrapper'>
					<div className='search-results-not-found'>
						<h3>{this.i18n('searchResults_nothingFound_title')}</h3>
						<p>{this.i18n('searchResults_nothingFound_content')}</p>
					</div>
				</div>
			)
		}

		// overlay message
		if (this.state.overlayIsActive) {
			overlayNoticeTitle = hasResults ? this.i18n('searchResults_overlay_resultsFound_title') : this.i18n('searchResults_overlay_noResultsFound_title');
			overlayNoticeContent = hasResults ? this.i18n('searchResults_overlay_resultsFound_content') : this.i18n('searchResults_overlay_noResultsFound_content');

			if (hasResults) {
				//overlayLoader = <SvgIcon icon='tick' />
				overlayLoader = <Badge label={hasResultsAmount} className='status-valid' />
			}
			else {
				overlayLoader = (
					<NetworkLoader />
				)
			}
		}

		return (
			<section className='search-results'>
				<div className={'search-results-overlay' + overlayIsActiveClassName} onClick={this.hideOverlay}>
					<div className='notice-wrapper'>
						<div className='click-to-hide-notice'>
							{overlayLoader}
							<div className='content'>
								<h3>{overlayNoticeTitle}</h3>
								<p>{overlayNoticeContent}</p>
							</div>
						</div>
					</div>
				</div>
				{noSearchStartedNotice}
				{noResultsFoundNotice}
				{resultList}

				{this.getDropzone()}
			</section>
		);
	}
});

module.exports = SearchResults;