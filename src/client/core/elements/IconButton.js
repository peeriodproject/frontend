/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var IconButton = React.createClass({

	getInitialState: function () {
		return {
			hoverClassName: ''
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
			hoverClassName: 'bg-color-inverted '
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
				className={'icon-btn ' + this.state.hoverClassName + this.props.className} 
				onClick={this.props.handleClick} 
				onMouseEnter={this.handleMouseEnter} 
				onMouseLeave={this.handleMouseLeave}
			></button>
		)
	}
});

module.exports = IconButton;