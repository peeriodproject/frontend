/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');
var RetinaMixin = require('../utils/RetinaMixin');

var Logo = React.createClass({

	mixins: [
		I18nMixin,
		RetinaMixin
	],

	getDefaultProps: function () {
		return {
			shadow: false,
			className: '',
			logoBaseName: 'icon',
			logoShadowBaseName: 'icon-shadow',
			imageSizes: [
				32,
				64,
				128,
				256,
				512,
				1024
			],
			width: -1
		};
	},

	getBaseName: function () {
		return this.props.shadow ? this.props.logoShadowBaseName : this.props.logoBaseName;
	},

	getLogoFileName: function () {
		var baseName = this.getBaseName();
		var width = this.props.width;
		var index;
		var size;

		if (width === -1 || !width) {
			return baseName;
		}

		index = this.props.imageSizes.indexOf(width);

		if (index !== -1) {
			return baseName + '-' + width;
		}
		
		for (var i = 0, l = this.props.imageSizes.length; i < l; i++) {
			size = this.props.imageSizes[i];
			
			if (size > width) {
				break;
			}
		}

		return size ? baseName + '-' + size : baseName;
	},

	render: function () {
		return (
			<img className={this.props.className} 
				src={'/assets/' + this.getRetinaImage('icons/' + this.getLogoFileName() + '.png')} 
				alt={this.i18n('appName') + ' – ' + this.i18n('appTagline')} />
		)
	}

});

module.exports = Logo;