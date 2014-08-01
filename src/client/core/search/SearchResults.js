/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var ChannelMixin = require('../socket/ChannelMixin');

var SearchResult = require('./SearchResult');

var resultTemplates = {
	text: require('../resultTemplates/TextResult')
};

var SearchResults = React.createClass({

	mixins: [
		ChannelMixin
	],

	channelNames: [
		'search',
		'share'
	],

	getInitialState: function () {
		return {
			results: null
		}
	},

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

	handleDownloadAbort: function (resultId) {
		this.shareChannel.send('removeDownload', resultId);
	},

	updateSearchChannelState: function (state) {
		console.log('channel update!');
		console.log(state);

		if (!state.currentResults) {
			return;
		}

		this.setState({
			results: state.currentResults
		});
	},

	updateShareChannelState: function (state) {
		console.log('foo', state);
	},

	render: function () {
		var results = {};

		if (this.state.results && this.state.results.total) {
			for (var i = 0, l = this.state.results.hits.length; i < l; i++) {
				var hit = this.state.results.hits[i];

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
			<ul className='search-results-list'>
				{results}
			</ul>
		);
	}
});

module.exports = SearchResults;