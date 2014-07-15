/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var TooltipMixin = require('../tooltip/TooltipMixin');
var SvgIcon = require('./SvgIcon');

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
			icon: '',
			disabled: false,
			onClick: function () {},
			onMouseEnter: function () {},
			onMouseLeave: function () {}
		};
	},

	handleMouseClick: function (e) {
		this.props.onClick(e);
		
		e.currentTarget.blur();
	},

	handleMouseEnter: function (e) {
		this.setState({
			hoverClassName: ''
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
		var disabledAtt = this.state.disabled ? disabled : null;

		return (
			<button 
				type='button'
				className={'icon-btn ' + this.state.hoverClassName + this.props.className + this.state.tooltipOpenClass} 
				onClick={this.handleMouseClick} 
				disabled={this.props.disabled}
				onMouseEnter={this.handleMouseEnter} 
				onMouseLeave={this.handleMouseLeave}
			>
				<SvgIcon icon={this.props.icon} />
			</button>
		)
	}
});

module.exports = IconButton;