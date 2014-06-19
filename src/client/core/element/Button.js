/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var Button = React.createClass({

	mixins: [I18nMixin],

	getDefaultProps: function () {
		return {
			className: '',
			label: 'elements_button_label',
			type: 'button',
			onClick: function () {},
			onMouseEnter: function () {},
			onMouseLeave: function () {}
		}
	},

	getInitialState: function () {
		return {
			hoverClassName: '',
			label: this.i18n(this.props.label)
		};
	},

	handleMouseClick: function (e) {
		var self = this;
		
		e.preventDefault();
		e.target.blur();

		this.setState({
			hoverClassName: 'bg-active '
		});

		self.props.onClick(e);
	},

	handleMouseEnter: function (e) {
		this.setState({
			hoverClassName: 'bg-hover bg-border-dark '
		});

		this.props.onMouseEnter(e);
	},

	handleMouseLeave: function (e) {
		this.setState({
			hoverClassName: ''
		});

		this.props.onMouseLeave(e);
	},

	render: function () {
		return (
			<button
				className={'btn bg-border-middle ' + this.state.hoverClassName + this.props.className}
				type={this.props.type}
				onClick={this.handleMouseClick}
				onMouseEnter={this.handleMouseEnter} 
				onMouseLeave={this.handleMouseLeave}
			>
				{this.state.label}
			</button>
		)
	}
});

module.exports = Button;