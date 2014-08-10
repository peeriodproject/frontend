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

	handleMouseClick: function (event) {
		this.props.onClick(event);
		
		event.currentTarget.blur();
	},

	handleMouseEnter: function (event) {
		this.setState({
			hoverClassName: ''
		});

		this.props.onMouseEnter(event);
	},

	handleMouseLeave: function (event) {
		this.setState({
			hoverClassName: ''
		});

		this.props.onMouseLeave(event);
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
				<SvgIcon icon={this.props.icon} onClick={this.handleMouseClick} />
			</button>
		)
	}
});

module.exports = IconButton;