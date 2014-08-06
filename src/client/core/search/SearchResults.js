/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var events = require('../events/EventEmitterMixin');
var ChannelMixin = require('../socket/ChannelMixin');

var Badge = require('../element/Badge');
var SearchResult = require('./SearchResult');

var resultTemplates = {
	text: require('../resultTemplates/TextResult')
};

var SearchResults = React.createClass({

	mixins: [
		ChannelMixin,
		events.mixinFor('SearchResultsRefresh'),
		events.mixinFor('SearchResultsNotificationsEnabled'),
		events.mixinFor('SearchResultsNotificationsDisabled')
	],

	channelNames: [
		'search',
		'share'
	],

	_overlayTimeout: null,

	getDefaultProps: function () {
		return {
			hideOverlayTimeoutDelay: 10000,
			resultsThresholdToFreeze: 3
		}
	},

	getInitialState: function () {
		return {
			query: null,
			results: null,
			frozenResults: null,
		}
	},

	/*componentWillReceiveProps: function (nextProps) {
		this.emitThr
	},*/

	getHitTemplate: function (hit) {
		var fields = hit.fields || {};

		return fields._template ? fields._template : 'text';
	},

	handleDownloadStart: function (resultId) {
		console.log('Sending download down the wire');
		this.shareChannel.send('addDownload', resultId, function (bar) {
			console.log('foo', bar);
		});
	},

	freezeResults: function (state) {
		state = state || this.state;

		this.setState({
			frozenResults: state.results
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
		console.log('below freezing. needs refresh');
		if (this.state.frozenResults) console.log(this.state.frozenResults.total);

		if (!this.state.frozenResults) {
			console.log('___ FREEZE ___');
			console.log(nextState);
			this.freezeResults(nextState);
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

		// results amount is above freezing. -> updating results
		if (nextState.results && nextState.results.total) {
			console.log('has results', nextState.status);
			//nextState.frozenResults = nextState.results;

			if (nextState.results.total <= this.props.resultsThresholdToFreeze) {
				console.log('above freezing, setting:', nextState.results.total);
				this.freezeResults(nextState);
				//nextState.frozenResults = nextState.results;
				//this.emitSearchResultsRefresh();
				if (nextState.results.total === this.props.resultsThresholdToFreeze) {
					this.freezingPoint(nextState);
					this.emitSearchResultsNotificationsEnabled();
				}
			}
			else if (nextState.results.total >= this.props.resultsThresholdToFreeze && (this.state.overlayIsActive || nextState.status !== 'CREATED')) {
				this.freezingPoint(nextState);

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
		else if (nextState.query && this.state.query !== nextState.query) {
			if (this._overlayTimeout) {
				clearTimeout(this._overlayTimeout);
			}

			console.log('setting overlay timeout');
			this._overlayTimeout = setTimeout(function () {
				console.log('clearing overlay');
				_this.hideOverlay()

				_this._overlayTimeout = null;
			}, this.props.hideOverlayTimeoutDelay);
			this.emitSearchResultsNotificationsDisabled();

			nextState.overlayIsActive = true;
		}
		else {
			nextState.frozenResults = null;
		}

		this.setState(nextState);

		console.log('channel update!', this.state.results.total);
		JSON.stringify(this.state.results.hits);
	},

	updateShareChannelState: function (state) {
		console.log('foo', state);
	},

	render: function () {
		var overlayIsActiveClassName = this.state.overlayIsActive ? ' active' : '';
		var results = {};

		// build templates
		if (this.state.frozenResults && this.state.frozenResults.total) {
			for (var i = 0, l = this.state.frozenResults.hits.length; i < l; i++) {
				var hit = this.state.frozenResults.hits[i];

				var template = resultTemplates[this.getHitTemplate(hit)];

				if (!template) {
					console.warn('No template found. Falling back to text!');
					template = resultTemplates['text'];
				}

				results[hit.response._id] = (
					<SearchResult resultId={hit.response._id} onDownloadStart={this.handleDownloadStart} onDownloadAbort={this.handleDownloadAbort}>
						<template fields={hit.fields} response={hit.response} />
					</SearchResult>
				)
			}
		}

		return (
			<div className='search-results'>
				<div className={'search-results-overlay' + overlayIsActiveClassName} onClick={this.hideOverlay}></div>
				<ul className='search-results-list'>
					{results}
					{/*<li style={{ height: '9000px' }}></li>*/}
				</ul>
			</div>
		);
	}
});

module.exports = SearchResults;