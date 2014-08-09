/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Feature = require('./Feature');

var FeatureManager = React.createClass({

	statics: {
		getFeatureList: function () {
			return {
				omnibox: {
					hasImage: true
				}
			};
		}
	},

	getDefaultProps: function () {
		return {
			getRandomFeature: true,
			featureName: ''
		};
	},

	render: function () {
		var features = this.type.getFeatureList();
		var featureNames;
		var feature;
		var name;

		if (this.props.featureName && features[this.props.featureName]) {
			name = this.props.featureName;
		}
		else if (this.props.getRandomFeature) {
			featureNames = Object.keys(features);

			name = featureNames[Math.floor(Math.random() * featureNames.length)];
		}

		if (name) {
			feature = <Feature name={name} hasImage={features[name].hasImage}  />
		}

		return (
			<div className='feature-manager'>{feature}</div>
		)
	}
});

module.exports = FeatureManager;