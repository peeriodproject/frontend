/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var SvgIcon = React.createClass({

	getDefaultProps: function () {
		return {
			extraLayer: '',
			extraStyles: ''
		}
	},

	getSvg: function (layerName, styles) {
		layerName = layerName ? ' class="' + layerName + '" ' : '';
		styles = styles || '';

		return '<svg' + layerName + ' style="' + styles + '"><use xlink:href="#icon-' + this.props.icon + '" /></svg>';
	},

	render: function () {
		var svg = this.getSvg();

		if (this.props.extraLayer) {
			svg += this.getSvg(this.props.extraLayer, this.props.extraStyles);
		}

		return (
			<span className={'icon icon-' + this.props.icon} dangerouslySetInnerHTML={{__html: svg }} />
		);
	}

});

module.exports = SvgIcon;