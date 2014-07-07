/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var SvgIcon = React.createClass({

	render: function () {
		return (
			<span className={'icon icon-' + this.props.icon} dangerouslySetInnerHTML={{__html: '<svg><use xlink:href="#icon-' + this.props.icon + '" /></svg>' }} />
		);
	}

});

module.exports = SvgIcon;