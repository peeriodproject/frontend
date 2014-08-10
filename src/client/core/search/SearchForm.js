/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Router = require('react-router-component');
var Link = require('react-router-component').Link;
var NavigatableMixin = require('react-router-component').NavigatableMixin;

var BackgroundPageMessageMixin = require('../socket/BackgroundPageMessageMixin');
var ChannelMixin = require('../socket/ChannelMixin');
var I18nMixin = require('../i18n/I18nMixin');

var Badge = require('../element/Badge');
var IconButton = require('../element/IconButton');

var SearchForm = React.createClass({

	_$input: null,

	mixins: [
		NavigatableMixin,
		BackgroundPageMessageMixin,
		ChannelMixin,
		I18nMixin
	],

	messages: [
		'startQuery'
	],

	channelNames: [
		'search',
		'protocol'
	],

	initialChannelsState: { 
		// state defaults
		queryValue: null,
		searchEnabled: true,
		
		// client defaults
		disabled: true,
		inputValue: '',
		gotResults: false
	},

	getDefaultProps: function () {
		return {
			isFullscreen: false,
			locationClassName: ''
		}
	},

	getSearchIcon: function () {
		var loadingStates = ['CREATED', 'GOT_RESULTS'];
		var icon = 'magnifying_glass';

		if (this.state.status === 'COMPLETE' && this.state.gotResults) {
			icon = 'tick';
		}
		else if (loadingStates.indexOf(this.state.status) !== -1) {
			icon = 'loading';
		}

		return icon;
	},

	componentDidMount: function () {
		this._$input = $(this.refs.searchField.getDOMNode());
		
		/*if (this._$input && !this.state.inputValue) {
			this._$input.focus();
		}*/

		/*if (!this.state.queryValue) {
			//console.log('component mounted! routing to /');
			this.navigate('/');
		}*/
		//window.addEventListener('unload', this.handleWindowUnload);
	},

	componentWillUnmount: function () {
		this._$input = null;
	},

	updateSearchChannelState: function (state) {
		var query = state.currentQuery || '';
		var inputValue = this.state.inputValue && state.currentQueryStatus ? this.state.inputValue : query;

		this.setState({
			queryValue: query,
			inputValue: inputValue,
			disabled: inputValue ? false : true,
			submitted: query === inputValue ? true : false,
			status: state.currentQueryStatus,
			gotResults: state.currentResults && state.currentResults.total ? true : false
		});
	},

	updateProtocolChannelState: function (state) {
		console.log('got protocol state');
		var searchEnabled = state.numOfHydraCircuits && state.numOfHydraCircuits > 0 ? true : false;

		this.setState({
			searchEnabled: searchEnabled
		});
	},

	removeQuery: function (ignoreUi) {
		if (this._$input && !ignoreUi) {
			this._$input.focus();
		}

		this.setState({
			inputValue: '',
			disabled: true,
			submitted: false,
			status: '',
			gotResults: false
		});

		this.searchChannel.send('removeQuery');
	},

	startQuery: function (value) {
		if (this.state.disabled || !this.state.searchEnabled || this.state.submitted) {
			return;
		}

		this.setState({
			inputValue: value,
			//disabled: this.state.inputValue === value
			submitted: true,
			status: 'CREATED'
		});

		this.searchChannel.send('addQuery', value);

		this.navigate('/search');
	},

	onStartQueryMessage: function (message) {
		var value = message.value || '';

		if (value) {
			this.removeQuery(true);
			this.setState({	disabled: false	});
			this.startQuery(value);
		}
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
		console.log('blur');

		if (!event.target.value) {
			this.removeQuery();
		}
		
		this.setState({
			focus: false
		});
	},

	handleClearButtonClick: function (event) {
		event.preventDefault();
		event.currentTarget.blur();

		this.removeQuery();
	},

	handleLogoClick: function (event) {
		event.preventDefault();
		event.currentTarget.blur();

		if (this.state.queryValue) {
			this.navigate('/search');
		}
		else {
			this.navigate('/');
		}

		return false;
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
		var searchIcon = this.getSearchIcon();
		var isEnabledClassName = !this.state.searchEnabled ? ' search-disabled' : '';

		return (
			<section className={'search-form-wrapper' + fullscreenClassName + isEnabledClassName + this.props.locationClassName}>
				<div className='logo-wrapper'>
					<Link href='/search' className='logo' onClick={this.handleLogoClick}>
						<img src='/assets/icons/icon128.png' />
					</Link>
				</div>

				<form className={'search-form' + focusClassName} ref='searchForm' onSubmit={this.handleSubmit}>
					<div className='search-disabled-notice'>
						{this.i18n('searchForm_searchIsDisabled_title')}
					</div>

					<input 
						type='text' 
						placeholder={this.i18n('search_input_placeholder')}
						className='search-input'
						ref='searchField'
						autoFocus
						onChange={this.handleInputChange}
						onFocus={this.handleInputFocus}
						onBlur={this.handleInputBlur}
						disabled={!this.state.searchEnabled}
						value={this.state.inputValue} />

					<IconButton 
						className='clear'
						icon='close'
						disabled={this.state.disabled || !this.state.searchEnabled}
						onClick={this.handleClearButtonClick} />

					<IconButton
						className='search'
						icon={searchIcon}
						type='submit'
						disabled={this.state.disabled || !this.state.searchEnabled}
						onClick={this.handleSubmit} />
				</form>

				{this.props.children}
			</section>
		)
	}

});

module.exports = SearchForm;