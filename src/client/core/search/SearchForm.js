/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Router = require('react-router-component');
var Link = require('react-router-component').Link;
var NavigatableMixin = require('react-router-component').NavigatableMixin;

var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

var Badge = require('../element/Badge');
var IconButton = require('../element/IconButton');

var SearchForm = React.createClass({

	_$input: null,

	mixins: [
		NavigatableMixin,
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

	getDefaultProps: function () {
		return {
			isFullscreen: false,
			locationClassName: ''
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
			disabled: false,
			submitted: true
		});
	},

	removeQuery: function () {
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

	startQuery: function (value) {
		if (this.state.disabled || this.state.submitted) {
			return;
		}

		this.setState({
			submitted: true
		});

		this.searchChannel.send('addQuery', value);

		this.navigate('/search');

		console.log('starting search for:', value);
	},

	handleInputChange: function (event) {
		this.setState({
			inputValue: event.target.value,
			disabled: event.target.value ? false : true,
			submitted: false
		});
	},

	handleInputFocus: function (event) {
		this.setState({
			focus: true
		});
	},

	handleInputBlur: function (event) {
		this.setState({
			focus: false
		});
	},

	handleClearButtonClick: function (event) {
		event.preventDefault();
		event.currentTarget.blur();

		this.removeQuery();
	},

	handleLogoClick: function () {
		this.removeQuery();
	},

	handleSubmit: function (event) {
		event.preventDefault();
		event.currentTarget.blur();

		this.startQuery(this.state.inputValue);
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
		var fullscreenClassName = this.props.isFullscreen ? ' fullscreen' : '';
		var focusClassName = this.state.focus ? ' focus' : '';

		return (
			<section className={'search-form-wrapper' + fullscreenClassName + this.props.locationClassName}>
				<div className='logo-wrapper'>
					<Link href='/' className='logo' onClick={this.handleLogoClick}>
						<img src='/assets/icons/icon128.png' />
					</Link>
				</div>
				<form className={'search-form' + focusClassName} ref='searchForm' onSubmit={this.handleSubmit}>
					<input 
						type='text' 
						placeholder={this.i18n('search_input_placeholder')}
						className='search-input'
						ref='searchField'
						onChange={this.handleInputChange}
						onFocus={this.handleInputFocus}
						onBlur={this.handleInputBlur}
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
				{this.props.children}
			</section>
		)
	}

});

module.exports = SearchForm;