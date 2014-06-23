/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var TooltipMixin = require('../tooltip/TooltipMixin');

var IconButton = React.createClass({

	mixins: [TooltipMixin],

	getInitialState: function () {
		return {
			hoverClassName: '',
			tooltipOpenClass: ''
		};
	},

	getDefaultProps: function () {
		return {
			className: '',
			onClick: function () {},
			onMouseEnter: function () {},
			onMouseLeave: function () {}
		};
	},

	handleMouseEnter: function (e) {
		this.setState({
			hoverClassName: 'bg-color '
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
				type='button'
				className={'icon-btn bg-color-dark ' + this.state.hoverClassName + this.props.className + this.state.tooltipOpenClass} 
				onClick={this.props.onClick} 
				onMouseEnter={this.handleMouseEnter} 
				onMouseLeave={this.handleMouseLeave}
			></button>
		)
	}
});

module.exports = IconButton;