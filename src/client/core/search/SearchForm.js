/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var Badge = require('../element/Badge');
//var Button = require('../element/Button');
var IconButton = require('../element/IconButton');

var SearchForm = React.createClass({

	mixins: [
		I18nMixin
	],

	getInitialState: function () {
		return {
			buttonsDisabled: true
		}
	},

	handleInputChange: function (event) {
		this.setState({
			buttonsDisabled: event.target.value ? false : true
		});
	},

	render: function () {
		//var icon = <SvgIcon icon='icon-magnifying_glass' />;

		return (
			<section className='search-form-wrapper'>
				<div className='logo-wrapper'>
					<a className='logo'>
						<Badge label='0' />
					</a>
				</div>
				<form className='search-form'>
					<input 
						type='text' 
						placeholder={this.i18n('search_input_placeholder')}
						className='search-input'
						onChange={this.handleInputChange} />

					<IconButton className='clear' disabled={this.state.buttonsDisabled} icon='close' />
					<IconButton className='search' disabled={this.state.buttonsDisabled} icon='magnifying_glass' type='submit' />
				</form>
			</section>
		)
	}

});

module.exports = SearchForm;