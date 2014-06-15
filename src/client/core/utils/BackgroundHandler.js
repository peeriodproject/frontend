/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Chroma = require('chroma-js');

window.Chroma = Chroma;

var BackgroundHandler = React.createClass({

	getDefaultProps: function () {
		return {
			minContrast: 4.5,
			activeAlpha: 0.2,
			hoverAlpha: 0.1,
			transitionKeys: ['color', 'background-color', 'border-color'],
			intervalInSeconds: 2
		};
	},

	getInitialState: function () {
		return {
			secondsElapsed: Math.round(Math.random() * 255),
			color: new Chroma('#fff'),
			background: new Chroma('#000'),
			invert: new Chroma('#000')
		};
	},

	tick: function () {
		var secondsElapsed = this.state.secondsElapsed + 1;
		var background = new Chroma('hsl(' + (this.state.secondsElapsed % 255) +  ', 100%, ' + (this.state.secondsElapsed % 100) + '%)');
		var color = this.getColor();

		if (Chroma.contrast(background, color) < this.props.minContrast) {
			color = this.toggleColor();
		}

		this.setState({
			secondsElapsed: secondsElapsed,
			color: color,
			invert: this.toggleColor(color),
			background: background,
		});
	},

	toggleColor: function (color) {
		var color = color || this.getColor();

		return color.luminance() ? color.darken(100) : color.brighten(100);
	},

	componentDidMount: function () {
		this.interval = setInterval(this.tick, this.props.intervalInSeconds * 1000);
	},

	componentWillUnmount: function () {
		clearInterval(this.interval);
	},

	getBackgroundColor: function () {
		return this.state.background;
	},

	getColor: function () {
		return this.state.color;
	},

	getInvertedColor: function () {
		return this.state.invert;
	},

	getAlphaColor: function (alpha) {
		return Chroma.scale([
			this.getBackgroundColor(),
			new Chroma(this.getColor())
		])(alpha);
	},

	getTransitionForKey: function (key, transitionDuration) {
		var duration = transitionDuration || this.props.intervalInSeconds;
		return 'transition: ' + key + ' ' + duration + 's linear';
	},

	createElementStyles: function (selector, styles, transitionDuration) {
		var keys = Object.keys(styles);
		var style = [];
		
		for (var i = 0, l = keys.length; i < l; i++) {
			var key = keys[i];
			style.push(key + ': ' + styles[key]);

			if (this.props.transitionKeys.indexOf(key) !== -1) {
				style.push(this.getTransitionForKey(key, transitionDuration));
			}
		}

		return selector + ' {\n\t' + style.join(';\n\t') + '\n}';
	},

	createStyles: function (styles) {
		return styles.join('\n');
	},

	render: function () {
		//var wrapper = '#wrapper { background-color: ; }';
		var styles = this.createStyles([
			this.createElementStyles('#wrapper, .bg', {
				'background-color': this.getBackgroundColor().hex()
			}),

			this.createElementStyles('.bg-hover', {
				'background-color': this.getAlphaColor(this.props.hoverAlpha).hex()
			}),

			this.createElementStyles('.bg-active', {
				'background-color': this.getAlphaColor(this.props.activeAlpha).hex()
			}),

			// color sheme
			this.createElementStyles('.bg-color-light', {
				'color': this.getAlphaColor(0.3).hex()
			}),

			this.createElementStyles('.bg-color-middle', {
				'color': this.getAlphaColor(0.5).hex()
			}),

			this.createElementStyles('.bg-color-dark', {
				'color': this.getAlphaColor(0.7).hex()
			}),

			this.createElementStyles('.bg-color-inverted', {
				'color': this.getInvertedColor().hex()
			}),

			// border
			this.createElementStyles('.bg-border', {
				'border-color': this.getAlphaColor(0.15).hex()
			}),

			this.createElementStyles('body, a', {
				'color': this.getColor().hex()
			})
		]);

		return (
			<style>
				{styles}
			</style>
		)
	}

});

module.exports = BackgroundHandler;