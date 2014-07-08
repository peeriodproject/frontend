/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var Badge = require('../element/Badge');
var IconButton = require('../element/IconButton');

var SearchForm = React.createClass({

	_$input: null,

	mixins: [
		I18nMixin
	],

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
	},

	componentWillUnmount: function () {
		this._$input = null;
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

		console.log('starting search for:', this.state.inputValue);
	},

	render: function () {
		return (
			<section className='search-form-wrapper'>
				<div className='logo-wrapper'>
					<a className='logo'>
						<Badge label='0' />
					</a>
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