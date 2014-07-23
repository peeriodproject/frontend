/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Link = require('react-router-component').Link;

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

var Badge = require('../element/Badge');
var IconButton = require('../element/IconButton');

var SearchForm = React.createClass({

	_$input: null,

	mixins: [
		ChannelMixin,
		I18nMixin
	],

	channelNames: [
		'search'
	],

	initialChannelsState: { 
		queryValue: null
	},

	getInitialState: function () {
		return {
			disabled: true,
			inputValue: ''
		}
	},

	componentDidMount: function () {
		this._$input = $(this.refs.searchField.getDOMNode());
		
		if (this._$input && !this.state.inputValue) {
			this._$input.focus();
		}

		//window.addEventListener('unload', this.handleWindowUnload);
	},

	componentWillUnmount: function () {
		this._$input = null;

		//window.removeListener('unload', this.handleWindowUnload);
	},

	updateSearchChannelState: function (state) {
		var query = state.currentQuery;

		if (!query) {
			return;
		}

		this.setState({
			queryValue: query,
			inputValue: (this.state.inputValue ? this.state.inputValue : query),
			submitted: true
		});
	},

	handleInputChange: function (event) {
		this.setState({
			inputValue: event.target.value,
			disabled: event.target.value ? false : true,
			submitted: false
		});
	},

	handleClearButtonClick: function (event) {
		event.preventDefault();
		event.currentTarget.blur();

		if (this._$input) {
			this._$input.focus();
		}

		this.setState({
			inputValue: '',
			disabled: true,
			submitted: false
		});

		this.searchChannel.send('removeQuery');
	},

	handleSubmit: function (event) {
		event.preventDefault();
		event.currentTarget.blur();

		if (this.state.disabled || this.state.submitted) {
			return;
		}

		this.setState({
			submitted: true
		});

		this.searchChannel.send('addQuery', this.state.inputValue);

		console.log('starting search for:', this.state.inputValue);
	},

	/**
	 * removes running queries.
	 *
	 * todo we should move this to the background.js 
	 * and do the clean up whenever the browser closes!
	 *
	 * @return {[type]} [description]
	 */
	handleWindowUnload: function () {
		this.searchChannel.send('removeQuery');
	},

	render: function () {
		return (
			<section className='search-form-wrapper'>
				<div className='logo-wrapper'>
					<Link href='/search' className='logo'>
						<Badge label='0' />
					</Link>
				</div>
				<form className='search-form' ref='searchForm' onSubmit={this.handleSubmit}>
					<input 
						type='text' 
						placeholder={this.i18n('search_input_placeholder')}
						className='search-input'
						ref='searchField'
						onChange={this.handleInputChange}
						value={this.state.inputValue} />

					<IconButton 
						className='clear'
						icon='close'
						disabled={this.state.disabled}
						onClick={this.handleClearButtonClick} />

					<IconButton
						className='search'
						icon='magnifying_glass'
						type='submit'
						disabled={this.state.disabled}
						onClick={this.handleSubmit} />
				</form>
			</section>
		)
	}

});

module.exports = SearchForm;