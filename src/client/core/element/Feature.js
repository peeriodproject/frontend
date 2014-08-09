/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var I18nMixin = require('../i18n/I18nMixin');

var Feature = React.createClass({
	
	mixins: [
		I18nMixin
	],

	getDefaultProps: function () {
		return {
			name: '',
			hasImage: false
		}
	},

	render: function () {
		var contentWrapper;
		var title;
		var content;
		var image;

		if (this.props.name) {
			title = (
				<h3>{this.i18n('feature_' + this.props.name + '_title')}</h3>
			)

			content = (
				<p>{this.i18n('feature_' + this.props.name + '_content')}</p>
			)
		}

		if (this.props.hasImage) {
			image = <img src={'/assets/images/feature-' + this.props.name + '.png'} />
		}

		if (title || content) {
			contentWrapper = (
				<div className='content-wrapper'>
					{title}
					{content}
				</div>
			)
		}

		return (
			<div className='feature-wrapper'>
				<div className='feature'>
					{image}
					{contentWrapper}
				</div>
			</div>
		)
	}
});

module.exports = Feature;